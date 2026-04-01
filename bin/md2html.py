#!/usr/bin/env python
# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "markdown>=3.10"
# ]
# ///

import markdown
import sys


MARKDOWN_EXTENSIONS = [
    "attr_list",
    "codehilite",
    "def_list",
    "fenced_code",
    "md_in_html",
    "tables",
]


def main():
    raw = open(sys.argv[1], "r").read()
    cooked = markdown.markdown(raw, extensions=MARKDOWN_EXTENSIONS)
    open(sys.argv[2], "w").write(cooked)


if __name__ == "__main__":
    main()
