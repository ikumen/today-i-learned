import mistune
import re

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


def create_renderer(escape=False, parse_block_html=False, parse_inline_html=False):
  return mistune.Markdown(
              renderer=CustomRenderer(), 
              escape=escape, 
              parse_block_html=parse_block_html,
              parse_inline_html=parse_inline_html)
