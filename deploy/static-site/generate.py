"""
Generate static HTML from markdown posts. 
"""
import os
import sys
from typing import Dict, List
import mistune
import re
import traceback
import time

from pathlib import Path
from parser import create_renderer


def extract_frontmatter(md_text):
  matches = re.findall(r'^\s*---\s*(.*)\s*---\n(.*)', md_text, re.DOTALL)
  if matches and len(matches[0]) == 2:
    # very fragile
    meta = matches[0][0].strip().split("\n")
    fm = {}
    for m in meta:
      k, v = m.split(":", maxsplit=1)
      v = v.strip()
      if k == 'tags':
        v = re.split(r'\s+|,\s*', v)
      fm[k] = v
    return fm, matches[0][1]
  else:
    return None, md_text


class Layout:
  def __init__(self, path, includes):
    self.path: Path = path
    self.prefix = None
    self.suffix = None
    self.includes = includes
    self.reload()

  def reload(self):
    html_fragments = {}
    for include in self.includes:
      with open(self.path.parent.joinpath(f"includes/{include}.html")) as reader:
        html_fragments[include] = reader.read()

    with open(self.path) as reader:
      html = reader.read()
      for id, frag in html_fragments.items():
        html = html.replace(f'@@{id}@@', frag)
      self.prefix, self.suffix = html.split("@@content@@")


class Post:
  def __init__(self, md_path: Path, html_path: Path, link: str = None):
    self.md_path = md_path
    self.html_path = html_path
    self.link = link
    self.fm = None
    self.mtime = None

  def html_parent(self) -> Path:
    return self.html_path.parent

  def has_modifications(self):
    mtime = os.stat(self.md_path).st_mtime
    if self.mtime != mtime:
      self.mtime = mtime
      return True
    return False

  def load_markdown(self):
    with open(self.md_path) as reader:
      md_text = reader.read()
      self.fm, md_text = extract_frontmatter(md_text)
      return self.fm, md_text


class SiteGenerator:
  def __init__(self, input_dir, output_dir, layout_config, renderer: mistune.Markdown):
    self.input_path = Path(input_dir)
    self.output_path = Path(output_dir)
    self.index_html_path = self.output_path.joinpath(self.index_html)
    self.index_md_path = self.input_path.joinpath(self.index_md)
    self.layout_path = layout_config['path']
    self.layout = Layout(**layout_config)
    self.posts = {}
    self.renderer = renderer
    self.layout_mtime = None
    self.index_mtime = None

  def generate_listing_index(self, force=False):
    mtime = os.stat(self.index_md_path).st_mtime
    if not force and self.index_mtime == mtime:
      return
    print(f" * {time.time()} {str(self.index_md_path)} => ...{str(self.index_html_path)[-10:]}")
    self.index_mtime = mtime  
    listing_str = ""
    for _, post in self.posts.items():
      if post.fm is not None:
        listing_str += self.listing_template.format(
            link=post.link, 
            title=post.fm.get('title', ''), 
            description=post.fm.get('description', ''))

    # Write out the listing items
    with open(self.index_md_path) as reader:
      md_text = reader.read()
      prefix, suffix = md_text.split("<!-- @@content@@ -->")
      with open(self.index_html_path, "w") as writer:
        html = self.renderer(prefix + '<ul class="list pa0 ma0">' + listing_str + "</ul>" + suffix)
        writer.write(self.layout.prefix + html + self.layout.suffix)

  def renderer_post(self, post: Post):
    if not post.html_parent().exists():
      post.html_parent().mkdir(parents=True)

    fm, md_text = post.load_markdown()
    with open(post.html_path, "w") as writer:
      writer.write(self.layout.prefix + self.renderer(md_text) + self.layout.suffix)

  def generate_posts(self, force=False):
    updated_posts = {}
    modified = False
    for md_path in self.input_path.glob("**/*.md"):
      if md_path == self.index_md_path:
        continue
      
      post = self.posts.get(md_path)
      if post is None:
        html_path = (self.output_path
          .joinpath(md_path.parent.relative_to(self.input_path))
          .joinpath(md_path.name[:-3]))
        link = f"/{html_path.relative_to(self.output_path)}/" 
        post = Post(md_path, html_path.joinpath(self.index_html), link)
      
      updated_posts[md_path] = post
      if post.has_modifications() or force:
        print(f" * {time.time()} {str(post.md_path)} => ...{str(post.html_path)[-30:]}")
        self.renderer_post(post)
        modified = True
    # Update our list of posts (removing/adding)    
    self.posts = updated_posts
    return modified


  def generate_all(self):
    mtime = os.stat(self.layout_path).st_mtime
    force = False
    if self.layout_mtime != mtime:
      print("Layout has changes, reloading...")
      self.layout.reload()
      self.layout_mtime = mtime
      force = True

    if self.generate_posts(force):
      self.generate_listing_index(force=True)
    else:
      self.generate_listing_index()


  def watch_and_generate(self):
    print(f"Watching {str(self.input_path)} for changes...")
    while True:
      try:
        time.sleep(5)
        self.generate_all()
      except KeyboardInterrupt:
        print("... done.")
        sys.exit(0)
      except:
        traceback.print_exc()
        sys.exit(1)


  index_html = "index.html"
  index_md = "index.md"
  listing_template = """<li class="mb3">
      <div class="f5"><a href="{link}">{title}</a></div>
      {description}
    </li>"""


def parse_argv():
  opts = {}
  for argv in sys.argv:
    parts = argv.split("=")
    opts[parts[0]] = parts[1] if len(parts) > 1 else None
  return opts


if __name__ == "__main__":
  opts = parse_argv()
  layout_includes = []
  if '-i' in opts:
    layout_includes = opts['-i'].split(",")

  site_generator = SiteGenerator(
      input_dir="posts",
      output_dir="src/main/resources/META-INF/resources",
      layout_config=dict(
        path=Path("deploy/static-site/layout.html"),
        includes=layout_includes),
      renderer=create_renderer())

  if '-w' in opts:
    site_generator.watch_and_generate()
  else:
    site_generator.generate_all()
  