<!DOCTYPE html>
<html lang="en" markdown="1">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Forma Examples using HTML</title>
<link href="./examples.css" rel="stylesheet" type="text/css"/>
</head>
<body markdown="1">

# Forma Examples using Markdown

## Multiple Choice

<div class="forma-multiple-choice" data-lang="en" markdown="1">

Which planet is closest to the Sun?

Venus
:   Wrong: Venus is the second planet from the Sun.

Mercury
:   Correct: Mercury is the first planet from the Sun.

Mars
:   Wrong: Mars is the fourth planet from the Sun.

</div>

## Flashcard

<div class="forma-flashcard" data-lang="en" markdown="1">

Python built-in functions

len(x)
:   Returns the number of items in x.

type(x)
:   Returns the type of x.
range(n)
:   Returns an iterable of integers from 0 up to (but not including) n.

print(x)
:   Writes x to standard output.

</div>

## Ordering

<div class="forma-ordering" data-lang="en" markdown="1">

Put these steps in the correct order to run a Python script:

1.  Write code in a .py file
1.  Open a terminal
1.  Navigate to the file's directory
1.  Run <code>python script.py</code>
1.  Read the output

</div>

## Matching

<div class="forma-matching" data-lang="en" markdown="1">

Match each Python keyword to its purpose:

| Keyword | Purpose |
| ------- | ------- |
| `def` | Define a function |
| `for` | Iterate over a sequence |
| `if` | Branch on a condition |
| `return` | Send a value back from a function |

</div>

## Labeling

<div class="forma-labeling" data-lang="en" markdown="1">

Label each line of this Python snippet:

| Code | Label |
| ---- | ----- |
| `def greet(name):` | Function definition |
| `message = "Hello, " + name` | Variable assignment |
| ` return message` | Return statement |
| `print(greet("world"))` | Function call |

</div>

## Concept Map

<div class="forma-concept-map" data-lang="en" markdown="1">

Draw the relationships between these data structure concepts:

| From | Link | To |
| ---- | ---- | -- |
| List | is a type of | Sequence |
| Tuple | is a type of | Sequence |
| Dictionary | maps keys to | Values |

</div>

## Numeric Entry

<div class="forma-numeric-entry" data-correct="42" data-tolerance="0.5" data-lang="en" markdown="1">

A list has 6 rows and 7 columns. How many elements does it contain?

</div>

## Predict Then Check

<div class="forma-predict-then-check" data-lang="en" markdown="1">

What does this code print?

```
words = ["apple", "banana", "cherry"]
print(len(words))
```

`2`
:   Wrong: len() counts the items, not the last index.

`3`
:   Correct: the list has three items, so len() returns 3.

`["apple", "banana", "cherry"]`
:   Wrong: len() returns a count, not the list itself.

<samp>3</samp>

</div>

<script type="module" src="../dist/forma.js"></script>
</body>
</html>
