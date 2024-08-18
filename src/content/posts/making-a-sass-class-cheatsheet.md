---
title: "Making a SASS Class Cheatsheet"
draft: false
date: 2024-08-18T08:00:00.000Z
includeToc: false
tags:
  - frontend
  - css
  - sass
  - cheatsheet
  - python
---

I'm working with some unfamiliar scss in a project, which has made it hard to know which utility classes are available.

I used GPT-4o to write a python script that generates the list of classes. It's already making it easier because I can scroll through the file and see what's available.

The requirements are python and sass, which can be installed with `npm install -g sass`.

Here's the python script:

```python
import re
import subprocess
import os


def compile_sass_to_css(sass_file_path, output_css_path):
    try:
        subprocess.run(["npx", "sass", sass_file_path, output_css_path], check=True)
        print(f"Compiled {sass_file_path} to {output_css_path} successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error during Sass compilation: {e}")
        exit(1)


def extract_classes(css_content):
    # Regular expression to match CSS class selectors
    class_regex = r"\.([a-zA-Z0-9_\-]+)\s*{"
    classes = re.findall(class_regex, css_content)
    return classes


def generate_cheatsheet(classes):
    cheatsheet = "CSS Classes Cheatsheet\n"
    cheatsheet += "=" * 30 + "\n"
    for cls in sorted(classes):
        cheatsheet += f".{cls}\n"
    return cheatsheet


def main():
    sass_file_path = "src/styles/main.scss"
    output_css_path = "output.css"
    cheatsheet_file_path = "css_cheatsheet.txt"

    # Step 1: Compile Sass to CSS
    compile_sass_to_css(sass_file_path, output_css_path)

    # Step 2: Read the compiled CSS content
    with open(output_css_path, "r") as file:
        css_content = file.read()

    # Step 3: Extract CSS classes and generate cheatsheet
    classes = extract_classes(css_content)
    cheatsheet = generate_cheatsheet(classes)

    # Step 4: Save the cheatsheet to a file
    with open(cheatsheet_file_path, "w") as output_file:
        output_file.write(cheatsheet)

    print(f"Cheatsheet created successfully as {cheatsheet_file_path}")


if __name__ == "__main__":
    # If needed, install sass with `npm install -g sass`
    main()

```

Here's the [transcript of the GPT-4o conversation](https://chatgpt.com/share/1a3ba910-4379-4c0a-86b1-50ad5cb0d6a4).
