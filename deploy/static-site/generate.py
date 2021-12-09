"""
Generates static html from repository README.md markdown pages. Specifically
this script will generate a main index.html from the main repository's README.md,
then any additional README.md under "src/main/java/com/gnoht/til" sub directories.

The README.md markdown files have relative paths that work when viewed from
github.com, so there is some additional cleanup to get the relative paths to
work for our website. Below is an example mapping:

[repository]                              [website]
  README.md ----------------------------> /index.html
  src/
    main/
      java/
        com/
          gnoht/
            til/
              datastructures/
                LinkedList.md ----------> /notes/java/datastructures/linkedlist/index.html
                README.md --------------> /notes/java/datastructures/index.html
              huffman_coding/
                README.md --------------> /notes/java/huffman_coding/index.html
              

"""
import mistune
import re

from pathlib import Path
from pygments import highlight
from pygments.lexers import get_lexer_by_name
from pygments.formatters import html


class CustomRenderer(mistune.Renderer):
  def header(self, text, level, raw):
    """Builds header anchor ids.
    """
    id = text.lower().replace(" ", "-")
    return f'<h{level} id="{id}">{text}</h{level}>'

  def block_code(self, code, lang="shell"):
    """
    If lang is given, format the output with syntax highlighting.
    """
    if lang:
      lexer = get_lexer_by_name(lang, stripall=True)
      formatter = html.HtmlFormatter(style='manni')
      return highlight(code, lexer, formatter)
    return '<div class="althighlight"><pre><code>' + mistune.escape(code) + '</code></pre></div>'

  def link(self, link, text=None, title=None):
    s = super().link(link, text, title)
    if link.startswith("http"): # assume it's external
      s = re.sub('>', ' target="_new">', s, count=1)
    return s


markdown = mistune.Markdown(renderer=CustomRenderer())
readme_file = "README.md"
index_file = "index.html"
base_repo_url = "https://github.com/ikumen/today-i-learned/blob/main"

# Directory to save generated files
generated_dir = "src/main/resources/META-INF/resources"
generated_dir_path = Path(generated_dir)

# Sections of source that may contain markdown we want to parse
sections = {
  # section: path to source
  'java': Path('src/main/java/com/gnoht/til'), 
  'python': Path('src/main/python'),
  'js': Path('src/main/js')
}

# Make the generated target directories exist
if not generated_dir_path.exists():
  generated_dir_path.mkdir(parents=True)


# Get layout template
with open("deploy/static-site/layout.html") as f:
  layout_prefix, layout_suffix = f.read().split("@@content@@")


"""
Build a mapping of all markdown files that are processed will use this mapping 
to update any references, for example:

notes_to_generate (paths from markdown => to html)
src/main/java/com/gnoht/til/datastructures/README.md => src/main/resources/META-INF/resources/notes/java/datastructures/index.html
src/main/java/com/gnoht/til/datastructures/LinkedList.md => src/main/resources/META-INF/resources/notes/java/datastructures/linkedlist/index.html 

normalized_paths (hrefs external => internal)
/src/main/java/com/gnoht/til/datastructures => /notes/java/datastructures
/src/main/java/com/gnoht/til/datastructures/LinkedList.md => /notes/java/datastructures/linkedlist 
"""
notes_to_generate = {}
normalized_paths = {}
for sec_name, sec_path in sections.items():
  if not sec_path.exists():
    continue

  for md_path in sec_path.glob("**/*.md"):
    _parent_path = md_path.parent
    _rel_parent_path = md_path.parent.relative_to(sec_path)
    _rel_generated_path = Path(f"notes/{sec_name}/{str(_rel_parent_path)}")
    _generated_path = generated_dir_path.joinpath(_rel_generated_path)
    if md_path.name == readme_file:
      notes_to_generate[md_path] = _generated_path.joinpath(index_file)
      # notes_to_generate[md_path] = _generated_path
      normalized_paths[f"/{_parent_path}"] = f"/{_rel_generated_path}/"
    else:
      _file = md_path.name[:-3].lower()
      notes_to_generate[md_path] = _generated_path.joinpath(f"{_file}/{index_file}")
      # notes_to_generate[md_path] = _generated_path.joinpath(_file)
      normalized_paths[f"/{md_path}"] = f"/{_rel_generated_path.joinpath(_file)}/"

# When trying to normalize paths, parent directories are picked up before 
# children by the replace method, so replace children paths first. We 
# generate external paths here and sort them to have child paths first.
normalized_ext_paths = sorted(list(normalized_paths.keys()), reverse=True)

def normalize_paths(md_text):
  """Given a source markdown, parse it for links that are relative to
  github repository, and normalize it to work locally on our static site.
  """
  # normalize external links that work
  md_text = re.sub(r']\((/src/main/\S+.(java|py|js)\))', r']({}\1'.format(base_repo_url), md_text)
  # normalize paths for the files we generated
  for ext_path in normalized_ext_paths:
    md_text = re.sub(r']\(({}(#\S+)?\))'.format(ext_path), r']({}\2)'.format(normalized_paths[ext_path]), md_text)
    # md_text = md_text.replace(ext_path, normalized_paths[ext_path])
  return md_text
  

def generate_notes():
  """Traverse through src directory looking for markdown files to parse 
  into html for static site. Each section under src/main gets mapped to 
  corresponding /notes/<language> directory in the static site.

  re.sub(r']\((/src/main/\w+.(java|py)\))', r'](//github.com/\1', s)
  """
  # generate notes
  for md_path, html_path in notes_to_generate.items():
    if not html_path.parent.exists():
      html_path.parent.mkdir(parents=True)

    with open(md_path) as reader:
      md_text = reader.read()
      md_text = normalize_paths(md_text)
      with open(html_path, "w") as writer:
        writer.write(layout_prefix + markdown(md_text) + layout_suffix)


def generate_main_index():
  """Generate the default index from root level README.
  """
  with open(readme_file) as reader:
    md_text = reader.read()
    md_text = normalize_paths(md_text)
    with open(generated_dir_path.joinpath(index_file), "w") as writer:
      writer.write(layout_prefix + markdown(md_text) + layout_suffix)


if __name__ == "__main__":
  generate_main_index()
  generate_notes()
