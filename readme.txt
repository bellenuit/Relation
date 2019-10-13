Relation

Relation is a command line program to do Relational Algebra with text files.
Relation can also be used online https://www.belle-nuit.com/relation/index.html

Documentation

http://www.belle-nuit.com/relation

The text files can be .csv (comma separated values) and .txt (tab separated values),. both in Unicode UTF 8.

Relation has an interactive shell that allows you to open and save relations

- read path
- write path

and to create relations directly

-relation column (column)*
- insert field (, field)*

The columns are not typed. The values are either strings or numbers depending on the context.
Any value other than 0 is considered true.

Once you have created the relations, you can make the relational operators

- select expression
- project column agregator? (, column agregator?)*
- union
- difference
- join (natural|left|right|outer|leftsemi|rightsemi|leftanti|expression)

Expressions can use

- columns
- numbers
- quoted strings
- mathematical operators + - / *
- cocatenation .
- comparison operators = != < <= >=
- logical operators and or nor not
- grouping paranthesis ()
- functions

Agregators can be

- count
- sum
- max
- min
- avg
- median
- stdefv

You can use also non-relational operators:

- extend column expression
- limit start count
- order column mode

The order mode can be A, Z (alphabetically normal and reverse), 1, 9 (numerically ascending or descending).

Finally, you can manipulate the operation stack:

- dup
- pop
- swap

And print out the results:

- print (or p)
- arity
- header
- graph
- // comment

And view and edit the history to rerun it:

- history
- edit line newtext
- run

The history of the command line can be saved as .rel file to be reused: 

- write h.rel
- read h.rel
- run

Installed functions
- abs(v)
- bar(v) shows a histogram bar using braille characters
- floor(v)
- ifnz(v1,v2) : use v2, if v1 is zero
- max/v1,v2)
- min(v1,v2)
- plusminus(v) shows a histogram bar with + and - characters
- replace(s,old,new)
- regex(exp,s)
- sqrt(v)




matti@belle-nuit.com
13.4.2019

