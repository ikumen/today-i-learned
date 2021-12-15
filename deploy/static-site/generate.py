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


# def convert_to_kebabcase(s):
#   """Convert given string to lower and kebabcase
#   (e.g., SomeString => some-string).
#   """
#   newstr = ''
#   for c in s:
#     if c.isupper():
#       if newstr != '':
#         newstr += '-'
#       newstr += c.lower()
#     else:
#       newstr += c
#   return newstr


# --- Globals ---
# file_stats = {}
# front_matter = {}
# readme_file = "README.md"
# index_file = "index.html"
# markdown = create_renderer()

# input_dir = "posts"
# input_dir_path = Path(input_dir)

# output_dir = "src/main/resources/META-INF/resources"
# output_dir_path = Path(output_dir)

# if not output_dir_path.exists():
#     output_dir_path.mkdir(parents=True)

# readme_path = Path(readme_file)
# layout_path = Path("deploy/static-site/layout.html")
# layout = Layout(layout_path)


# --- Globals end ---


# def generate_html(md_path: Path, html_path: Path):
#   """Generate the html page for given markdown.
#   """
#   if not html_path.exists():
#     html_path.mkdir(parents=True)

#   with open(md_path) as reader:
#     md_text = reader.read()
#     fm, md_text = extract_frontmatter(md_text)
#     if fm:
#       front_matter[html_path] = fm
#     with open(html_path.joinpath(index_file), "w") as writer:
#       writer.write(layout.prefix + markdown(md_text) + layout.suffix)


# def generate_all(generate_only=None):
#   """Iterate through all markdowns and if no filter (e.g, generate_only given), 
#   generate all or only apply filter.
#   """
#   if generate_only is None:
#     generate_only = []

#   generated = []
#   def _generate(md_path):
#     """Do actual work
#     """
#     nonlocal generated
#     if generate_only and md_path not in generate_only:
#       return

#     html_path = output_dir_path.joinpath(md_path.parent.relative_to(input_dir_path))
#     if md_path.name == readme_file:
#       generate_html(md_path, html_path)
#     else:
#       generate_html(md_path, html_path.joinpath(md_path.name[:-3]))
#     file_stats[md_path] = os.stat(md_path).st_mtime
#     generated.append(str(md_path))

#   # Generate html from <repo>/posts
#   for md_path in input_dir_path.glob("**/*.md"):
#     _generate(md_path)

#   # Update the main index page
#   generate_main_index()
#   return generated



# def generate_main_index():
#   html_path = output_dir_path.joinpath(index_file)
#   with open(readme_path) as reader:
#     md_text = reader.read()
#     prefix, suffix = md_text.split("<!-- @@content@@ -->")
#     prefix += '<ul>'
#     for p, meta in front_matter.items():
#       prefix += f"""
#       <li class="mb3">
#       <article class="f5"><a href="/{p.relative_to(output_dir)}/">{meta["title"]}</a></article>
#       {meta["description"]}
#       </li>
#       """
#     md_text = prefix + '</ul>' + suffix
#     with open(html_path, "w") as writer:
#       writer.write(layout.prefix + markdown(md_text) + layout.suffix)


# def has_modifications(file_path):
#   mtime = os.stat(file_path).st_mtime
#   if file_path not in file_stats or file_stats[file_path] != mtime:
#     file_stats[file_path] = mtime
#     return True
#   return False

# posts: Dict[Path, Post] = {}

# def on_posts_changed(ignores=None, force=False):
#   if ignores is None:
#     ignores = []

#   processed = 0
#   for md_path in input_dir_path.glob("**/*.md"):
#     if md_path in ignores: 
#       continue      
#     if md_path not in posts:
#       html_path = (output_dir_path
#           .joinpath(md_path.parent.relative_to(input_dir_path))
#           .joinpath(md_path.name[:-3])
#           .joinpath(index_file))
#       posts[md_path] = Post(md_path, html_path)

#     post = posts[md_path]
#     if force or post.has_modifications():
#       _, text = post.parse()
#       with open(post.html_path, "w") as writer:
#         writer.write(layout.prefix + markdown(text) + layout.suffix)
#       processed += 1
#   return processed


# def on_index_changed(site_index: SiteIndex, force=False):
#   if site_index is None:
#     md_path = input_dir_path.joinpath(index_file)
#     html_path = (output_dir_path
#         .joinpath(md_path.parent.relative_to(input_dir_path))
#         .joinpath(index_file))
#     site_index = SiteIndex(md_path, html_path)
#   if site_index.has_modifications():
#     with open(site_index.html_path, "w") as writer:
#       writer.write(layout.prefix + site_index.parse() + layout.suffix)

# def on_layout_changed():
#   layout.reload()
#   on_posts_changed(force=True)
#   on_index_changed(force=True)

# def detect_modifications():
#   """Iterate through all markdown files and check if any have been
#   modified since we last checked.
#   """
#   mod_files = []
#   # detect everything in <repo>/posts
#   for md_path in input_dir_path.glob("**/*.md"):
#     if has_modifications(md_path):
#       mod_files.append(md_path)
#   return mod_files

##### Globals
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
  def __init__(self, path):
    self.path = path
    self.prefix = None
    self.suffix = None
    self.reload()

  def reload(self):
    with open(self.path) as reader:
      self.prefix, self.suffix = reader.read().split("@@content@@")


# input_path = Path("posts")
# output_path = Path("src/main/resources/META-INF/resources")
# index_html = "index.html"
# index_md = "index.md"
# index_html_path = output_path.joinpath(index_html)
# index_md_path = input_path.joinpath(index_md)

# layout_path = Path("deploy/static-site/layout.html")
# layout = Layout(layout_path)

# listing_item_template = """
# <li class="mb3">
# <div class="f5"><a href="{link}">{title}</a></div>
# {description}
# </li>
# """

class Post:
  def __init__(self, md_path: Path, html_path: Path, link: str = None):
    self.md_path = md_path
    self.html_path = html_path
    self.link = link
    self.fm = None
    self.mtime = None

  def html_parent(self):
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
  def __init__(self, input_dir, output_dir, layout_file, renderer: mistune.Markdown):
    self.input_path = Path(input_dir)
    self.output_path = Path(output_dir)
    self.index_html_path = self.output_path.joinpath(self.index_html)
    self.index_md_path = self.input_path.joinpath(self.index_md)
    self.layout_path = Path(layout_file)
    self.layout = Layout(self.layout_path)
    self.posts = {}
    self.renderer = renderer
    self.layout_mtime = None
    self.index_mtime = None

  def generate_listing_index(self, force=False):
    mtime = os.stat(self.index_md_path).st_mtime
    if not force and self.index_mtime == mtime:
      return
    print(f" * {str(self.index_md_path)} => ...{str(self.index_html_path)[-10:]}")
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
        html = self.renderer(prefix + "<ul>" + listing_str + "</ul>" + suffix)
        writer.write(self.layout.prefix + html + self.layout.suffix)

  def renderer_post(self, post: Post):
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
        print(f" * {str(post.md_path)} => ...{str(post.html_path)[-30:]}")
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



# def watch_and_generate():
#   print(f"Watching {input_dir} for changes...")
#   mtimes = dict(layout_path=None, input_path=None)
#   while True:
#     try:
#       time.sleep(3)
#       # if layout changed reload layout and regen all
#       if has_modifications(mtimes):
#         gen()
#     except KeyboardInterrupt:
#       print("... done.")
#       sys.exit(0)
#     except:
#       traceback.print_exc()
#       sys.exit(1)

# def watch_and_generate_old():
#   print("Watching for changes....")
#   while True:
#     try:
#       time.sleep(3)
#       generated = []
#       layout_modified = has_modifications(layout_path)
#       main_index_modified = has_modifications(readme_path)
#       if not file_stats or layout_modified or main_index_modified:
#         if layout_modified:
#           layout.reload()
#         generated = generate_all()
#       else:
#         mod_files = detect_modifications()
#         if mod_files:
#           generated = generate_all(generate_only=mod_files)
        
#       if generated:
#         print(f"Generated html for: {generated}")
#     except KeyboardInterrupt:
#       print("Done.")
#       sys.exit(0)
#     except:
#       traceback.print_exc()
#       sys.exit(1)


if __name__ == "__main__":
  site_generator = SiteGenerator(
      input_dir="posts",
      output_dir="src/main/resources/META-INF/resources",
      layout_file="deploy/static-site/layout.html",
      renderer=create_renderer())

  if len(sys.argv) > 1 and sys.argv[1] == "-w":
    site_generator.watch_and_generate()
  else:
    site_generator.generate_all()
  # cache = {}
  # while True:
  #   try:
  #     time.sleep(3)
  #     paths = list(Path("posts").glob("**")) + [Path("deploy/static-site")]
  #     for path in paths:
  #       mtime = os.stat(path).st_mtime
  #       if cache.get(path) != mtime:
  #         print('changed')
  #         cache[path] = mtime
  #   except KeyboardInterrupt:
  #     sys.exit(0)
