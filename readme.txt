Relation

Relation is a command line program to do Relational Algebra with textfiles.
Relation can also be used online https://www.belle-nuit.com/relation/index.html


Documentation

http://www.belle-nuit.com/relation

The text files can be .csv (comma separated values) and .txt (tab separated values),. both in Unicode UTF 8.

Relation has an interactive shell that allows you to open and save relations

read path
write path
and to create relations directly

relation column (column)*
insert field (, field)*
The columns are not typed. They are either strings or numbers depending on the context

Once you have created the relations, you can make the relational operations

select expression
project column agregator? (, column agregator?)*
union
difference
join (natural|left|right|outer|leftsemi|rightsemi|leftanti|expression)
Expressions can use

columns
numbers
quoted strings
mathematical operators + - / *
comparison operators = != < <= >=
logical operators and or nor not
grouping paranthesis ()
Agregators can be

count
sum
max
min
avg
median
You can use also non-relational non relational operations):
extend column expression
limit start count
order column ordermode

The ordermode can be A, Z, 1, 9

Finally, you can manipulate the operation stack:

dup
pop
swap
And print out the results:

print
arity
header
graph
// comment
And view and edit the history:

history
edit line newtext
The history of the command line can be saved as .rel file to be reused.

matti@belle-nuit.com
13.4.2019

