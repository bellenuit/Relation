const readline = require('readline');
const process = require("process");
const fs = require("fs");

function completer(line) {
  const completions = 'arity count difference dup edit extend graph header help history insert join limit order pop print project q quit read relation rename swap union write'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : completions, line];
}


var rl = readline.createInterface(process.stdin, process.stdout, completer, true, 10);
var prefix = '> ';
var prefix1 = '> ';
var stack = [];  
var history = [];  
var s = '';
var interactive = 1;

if (process.argv.length > 3 && process.argv[2] == '-b')
{	
	interactive = 0;
	var list = fs.readFileSync(process.argv[3],'utf8').split('\n');
	for (t in list) {
		linehandler(list[t]);
	}
	interactive = 1;
}


function linehandler(line) {
  
  if (line == '') { swHistory.push(line); return; }
  var command = line.replace(/ .*/,'').toLowerCase();
  var body = line.substr(command.length+1);
  var fields = body.split(' ');
  var commafields = body.split(',').map(function(s) { return s.trim(); } );
  var rel;
  var rel2;
  try {
  switch(command) {
  	case '//':	 console.log(body); history.push(line); break;
  	case 'arity':	
  		 if (stack.length < 1) { console.log('Error: stack empty'); break; }
  		 rel = stack.pop(); stack.push(rel); console.log(rel.header.length); break;
  	case 'count':	
  		 if (stack.length < 1) { console.log('Error: stack empty'); break; }
  		 rel = stack.pop(); stack.push(rel); console.log(rel.tuples.length); break;
   	case 'difference':
   		  if (stack.length < 2) { console.log('Error: stack empty'); break; }
 		  try { rel2 = stack.pop(); rel = stack.pop();  rel=rel.difference(rel2); stack.push(rel); } 
 		  catch(e) { console.log(e.toString()) ; } 
 		  history.push(line); break;
   	case 'dup':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); stack.push(rel); 
 		  rel2 = new swRelation(rel.header);
 		  rel2.tuples = rel.tuples.slice();
 		  stack.push(rel2); 
 		  history.push(line); break;
 	case 'edit':
 		  var pos = fields[0];
 		  var rem = 1;
 		  if (/\+/.test(pos)) { pos = pos.replace(/\+/,''); rem = 0};
 		  if (pos < 1 || pos > history.length) { console.log('Error: edit position out of range'); break; }
 		  var body2 = body.substr(pos.length+1).trim();
 		  if (body2 !='')
 		 	history.splice(pos*1-1,rem,body2);
 		  else
 		  	history.splice(pos*1-1,rem);
 	      break;
   	case 'extend':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); try { 
 		  var lbl = body.replace(/ .*/,'');
 		  var expr = body.substr(lbl.length+1);
 		  rel=rel.extend(lbl, expr);} catch(e) { console.log(e.toString()) ; } stack.push(rel); 
 		  history.push(line);
 		  break;
 	case 'graph':
 		  var level = -1;
 		  var pf0 = ('│'+' '.repeat(30)+' ');
 		  for (i in history)
 		  {
 		 	var s = history[i];
 		 	var c = s.replace(/ .*/,'').toLowerCase();
 		 	var b = line.substr(command.length+1);
 		 	switch(c)
 		 	{
 		 		case 'arity':
 		 		case 'count':
 		 		case 'edit':
 		 		case 'graph':
 		 		case 'header':
 		 		case 'help':
 		 		case 'history':
 		 		case 'q': 
 		 		case 'run':
				continue;
 		 		
 		 		case 'extend':
 		 		case 'insert':
 		 		case 'limit':
 		 		case 'order':
 		 		case 'print':
 		 		case 'p':
 		 		case 'project':
 		 		case 'rename':
 		 		case 'select':
 		 		pf = pf0.repeat(level);
 		 		console.log(pf+'│'); break;
 		 		
 		 		case 'read': 
 		 		case 'relation': level = level + 1; break;
 		 		
 		 		case 'dup': level = level + 1; 
 		 		
 		 		console.log(pf+'├'+'─'.repeat(31)+'┐');
 		 		
 		 		break;
 		 		
 		 		case 'difference': 
 		 		case 'join':  
 		 		case 'union': level = level - 1; 
 		 		
 		 		pf = pf0.repeat(level);
 		 		console.log(pf+'├'+'─'.repeat(31)+'┘');
 		 		
 		 		break;
 		 		
 		 		case 'pop': level = level -1 ; 
 		 					console.log(pf + s);
 		 					pf = pf0.repeat(level); continue;
 		 		
 		 		
 		 		case 'swap':
 		 		level = level - 1; 
 		 		pf = pf0.repeat(level);
 		 		
 		 		console.log(pf+'╞' +'═'.repeat(31)+'╡');
 		 		
 		 		
 		 		level = level +1; 
 		 		pf = pf0.repeat(level);
 		 		console.log(pf + s);
 		 		continue;
 		 		
 		 		default: continue;
 		 		
 		 	}
 		 	
 		 	
 		 	pf = pf0.repeat(level);
 		 	
 		 	// greek
 		 	//c = c.replace('select','σ').replace('project','π').replace('rename','ρ').replace('union','∪').replace('join','⨝')
 		 	//s = c+' '+b;
 		 	
 		 	//console.log(pf + '┌'+'─'.repeat(30)+'┐');
 		 	//console.log(pf + '│ '+(s+' '.repeat(28)).substr(0,28)+' │');
 		 	//console.log(pf + '└'+'─'.repeat(30)+'┘');
 		 	console.log(pf + s);
 		 	
 		  }
 	
 	
 		  break;
  	case 'header':	
  		 if (stack.length < 1) { console.log('Error: stack empty'); break; }
  		 rel = stack.pop(); stack.push(rel); console.log(rel.header.join(',')); break;
  	case 'help':
  	     switch (body.trim())
  	     {  			
  		  	case 'arity': console.log('arity : prints arity of current relation'); break;
  		  	case 'count': console.log('count : prints row count of current relation'); break;
  		  	case 'difference': console.log('difference : calculates relationy y \\ x'); break;
  		  	case 'edit': console.log('edit n command : edit history line n. Use + to insert before'); break;
  		  	case 'dup': console.log('dup : duplicates current relation in the stack'); break;
  		  	case 'extend': console.log('extend c expression : extends relation with column c using expression which can include any current column'); break;
  		  	case 'help': console.log('help command : displays help for all commands'); break;
  		  	case 'graph': console.log('graph : shows history of commands as graph. Only relation-related commands and print are in history'); break;
  		  	case 'history': console.log('history : shows history of commands. Only relation-related commands and print are in history'); break;
  		  	case 'insert' : console.log('insert value (, value)* : inserts new row into current relation'); break;
   		  	case 'join': console.log('join expression : calculates relationy y ⨝ x using expression which can include any column of both relations.')
   		  	console.log('Duplicated column names use _2 for second relation.');
   		  	console.log('Special expressions and modifieres: NATURAL, LEFT, RIGHT, OUTER, LEFTSEMI, RIGHTSEMI, LEFTANTI'); break;
 		  	case 'limit': console.log('limit start count : chooses only count rows starting with row start'); break;
 		  	case 'order': console.log('order column mode (, column mode)* : orders by columns. Modes are A (alphabetically), Z (alphabetically reversed), 1 (numerical low first), 9 (numerical high first)'); break;
  		  	case 'pop': console.log('pop : removes current relation from the stack'); break;
  		  	case 'p': case 'print': console.log('print : prints the current relation to the console'); break;
  		  	case 'project': console.log('project column (aggregator?) (, column aggregator?)* : selects columns in current relation, may use aggregators.');
  		  	console.log('Possible aggregators: AVG, COUNT, MIN, MAX, MEDIAN, SUM'); break;
  		  	case 'q': case 'quit': console.log('quit : ends program'); break;
  		  	case 'swap': console.log('swap : exchanges the current relation with the lower relation in the stack'); break;
  		  	case 'read': console.log('read path : reads datafile which can be .txt (tab), .csv or .rel (relation command list)'); break;
  		  	case 'run': console.log('run : reruns history on new blank stack'); break;
  		  	case 'relation': console.log('relation column (, column)* : creates empty relation with defined columns'); break;
  		  	case 'rename': console.log('relation column name (, column name)* : renames columns of current relation'); break;
  		  	case 'select': console.log('select expression : selects rows in current relation using expression which can include any current column'); break;
  		  	case 'union': console.log('union : calculates relationy y ∪ x'); break;
  		  	case 'write': console.log('write path : writes current relation to datafile which can be .txt (tab) or csv. Writes current history to .rel file'); break;

  		  	default: console.log('Commands: arity count difference dup edit extend header help history insert join limit order pop print project q quit read relation run swap union write'); 
  		  	console.log('You can also use -b file.rel to run relation non-interactively');
  		  	break;
  		  }
  		  break;
   	case 'history':
   		  for (i in history)
 		  {
 		  	 var s = history[i];
 		  	 console.log ((i*1+1)+': '+s);
 		  }
   		  break;
   	case 'insert':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
   		  rel = stack.pop(); rel.insert(commafields); stack.push(rel); 
   		  history.push(line); break;
   	case 'join':
   		  if (stack.length < 2) { console.log('Error: stack empty'); break; }
 		  rel2 = stack.pop(); 
 		  rel = stack.pop(); 
 		  rel=rel.join(rel2,body); stack.push(rel); 
 		  history.push(line); break;
   	case 'limit':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); rel=rel.limit(Number(fields[0]),Number(fields[1])); stack.push(rel); 
 		  history.push(line); break;
   	case 'order':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); try { rel=rel.order(commafields);} catch(e) { console.log(e.toString()) ; } stack.push(rel); 
 		  history.push(line); break;  	
   	case 'pop':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
   		  rel = stack.pop(); 
   		  history.push(line); break;
  	case 'print':
  	case 'p':
  		 if (stack.length < 1) { console.log('Error: stack empty'); break; }
  		 rel = stack.pop(); rel.print(); stack.push(rel);
  		 history.push(line); break;
   	case 'project':
   		  if (stack.length < 1) { console.log('Error: stack empty');  break; }
 		  rel = stack.pop(); try { rel=rel.project(commafields); history.push(line);} catch(e) { console.log(e.toString()) ; }  stack.push(rel); break;
    case 'q': rl.close(); break;
  	case 'read': 
  		try
  		{
  			rel = new swRelation([]); 
  			switch(body.substr(-3))
  			{
  				case 'txt':  s = fs.readFileSync(body,'utf8'); rel = rel.fromTab(s); stack.push(rel); history.push(line); break;
  				case 'csv':  s = fs.readFileSync(body,'utf8'); rel = rel.fromCSV(s); stack.push(rel); history.push(line); break;
  				case 'rel':  var list = fs.readFileSync(body,'utf8').split('\n');
  							 interactive = 0;
  							 for (t in list) {
								linehandler(list[t]);
								history.push(line);
							}
							interactive = 1;
							break;
  							 
  				default : throw 'Error: invalid filetype';
  			}
  			
  		}
  		catch(e) { console.log(e.toString()) ; }
  		
  		break;
   	case 'relation':
   		  rel = new swRelation(commafields); stack.push(rel); 
   		  history.push(line); break;
   	case 'rename':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); try { rel=rel.rename(commafields); history.push(line);} catch(e) { console.log(e.toString()) ; } stack.push(rel); 
 		  break;
    case 'run':	var list = history.slice(); history = []; stack = [];
  							 interactive = 0;
  							 for (t in list) {
								linehandler(list[t]);
							}
							interactive = 1;
							break;
   	case 'select':
   		  if (stack.length < 1) { console.log('Error: stack empty'); break; }
 		  rel = stack.pop(); try { rel=rel.select(body); history.push(line);} catch(e) { console.log(e.toString()) ; } stack.push(rel); 
 		  break;
   	case 'swap':
   		  if (stack.length < 2) { console.log('Error: stack empty'); break; }
 		  rel2 = stack.pop(); 
 		  rel = stack.pop(); 
 		  stack.push(rel2); 
 		  stack.push(rel); 
 		  history.push(line); break;
   	case 'union':
   		  if (stack.length < 2) { console.log('Error: stack empty'); break; }
 		  rel2 = stack.pop(); 
 		  rel = stack.pop(); 
 		  rel=rel.union(rel2); stack.push(rel); 
 		  history.push(line); break;
 	case 'write': 
 		if (stack.length < 1) { console.log('Error: stack empty'); break; }
  		try
  		{
  			rel = stack.pop();
  			stack.push(rel);
  			switch(body.substr(-3))
  			{
  				case 'txt':  fs.writeFileSync(body, rel.toTab(), 'utf8'); break;
  				case 'csv':  fs.writeFileSync(body, rel.toCSV(), 'utf8'); break;
  				case 'rel':  fs.writeFileSync(body, history.join('\n'), 'utf8'); break;
  				default : throw 'Error: invalid filetype';
  			}
  		}
  		catch(e) { console.log(e.toString()) ; }
  		history.push(line); break;
    default:
      console.log('Say what? Did you mean "' + line.trim() + '"?');
      break;
  }
  }
  catch (e)  {	console.log(e.toString()) ; }
  
  prefix1 = '+'.repeat(stack.length)+prefix;
  if (interactive) {
 	 rl.setPrompt(prefix1, prefix1.length);
 	 rl.prompt();
 }
}

rl.on('line', linehandler ).on('close', function() {
  console.log('Bye!');
  process.exit(0);
});
if (interactive)
{
	console.log('Relation 1.0 © 2019 belle-nuit.com');
	rl.setPrompt(prefix, prefix.length);
	rl.prompt();
}




function array_unique(arr){

	function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
	}
	return arr.filter( onlyUnique );

}
function replace_all(text,oldstring,newstring){

	var result = text;
	
	while (result.indexOf(oldstring) > -1)
		result = result.replace(oldstring,newstring);
	return result;
	

}

function check_identifiers(arr) {

	var regex = /^[a-zA-Z_][a-zA-Z0-9_]{0,30}$/;
	for (var i in arr) {
		var id = arr[i].toString().trim();
		if (!regex.test(id))
			throw "invalid identifier (" + id + ")"+id.length;
	}
}

function fix_identifier(s) {
	s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // decode accents and remove them
	s = s.replace(/-/g,'_');
	s = s.replace(/\s/g,'_');
	return s;
}


function evaluate(script){
	return eval(script);
}

function jsonCopy(src) {
  return JSON.parse(JSON.stringify(src));
}

function is_numeric(s) { return !isNaN(s - parseFloat(s)); }

function isset(accessor) {
  try { return typeof accessor() !== 'undefined'; } catch (e) { return false; }
}

function parseCSV(str) {
    var arr = [];
    var quote = false;  // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (var row = 0, col = 0, c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];        // current character, next character
        arr[row] = arr[row] || [];             // create a new row if necessary
        arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  

        // If it's just one quotation mark, begin/end quoted field
        if (cc == '"') { quote = !quote; continue; }

        // If it's a comma and we're not in a quoted field, move on to the next column
        if (cc == ',' && !quote) { ++col; continue; }

        // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }

        // If it's a newline (LF or CR) and we're not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }

        // Otherwise, append the current character to the current column
        arr[row][col] += cc;
    }
    return arr;
}


function encodeURIComponent2(s) 
	{ 
		var s = encodeURIComponent(s); 
		while(s.match(/[+_.-/()]/))
			s = s.replace('+','%20').replace('_','%5F').replace('.','%2E').replace('-','%2D').replace('/','%2F').replace('(','%28').replace(')','%29');
		return s; 
	} 



function swExpression(expression, extentions)
{

	
	var functions = {};
	var arities = {};
	var rpn = '';
	var source = '';
	
	
	arities['neg'] = 1; functions['neg'] = function(a) { return -parseFloat(a[0]) ; };
	arities['mul'] = 2; functions['mul'] = function(a) { return parseFloat(a[1])*parseFloat(a[0]);};
	arities['div'] = 2; functions['div'] = function(a) { if (a[0]==0) throw 'ERROR division by zero'; return parseFloat(a[1])/parseFloat(a[0]);};
	arities['add'] = 2; functions['add'] = function(a) { return parseFloat(a[1])+parseFloat(a[0]);};
	arities['sub'] = 2; functions['sub'] = function(a) { return parseFloat(a[1])-parseFloat(a[0]);};
	arities['concat'] = 2; functions['concat'] = function(a) { return a[1]+a[0];};
	
	arities['equal'] = 2; functions['equal'] = function(a) { if (a[1]==a[0]) return 1; return 0;};
	arities['notequal'] = 2; functions['notequal'] = function(a) { if( a[1]!=a[0]) return 1; return 0;};
	arities['lower'] = 2; functions['lower'] = function(a) { if( a[1]<a[0]) return 1; return 0;};
	arities['greater'] = 2; functions['greater'] = function(a) { if( a[1]>a[0]) return 1; return 0;};
	arities['lowerequal'] = 2; functions['lowerequal'] = function(a) { if( a[1]<=a[0]) return 1; return 0;};
	arities['greaterequal'] = 2; functions['greaterequal'] =  function(a) { if( a[1]>=a[0]) return 1; return 0;};
	
	arities['logand'] = 2; functions['logand'] = function(a) { if( a[1] && a[0]) return 1; return 0;};
	arities['logor'] = 2; functions['logor'] = function(a) { if( a[1] || a[0]) return 1; return 0;};
	arities['logxor'] = 2; functions['logxor'] = function(a) { if((a[1] || a[0])&&(!a[1] || !a[0]) ) return 1; return 0;};
	arities['not'] = 1; functions['not'] = function(a) { return !a[0]; };
	
	arities['regex'] = 2; functions['regex'] = function(a) {
	//console.log(a);
	var r = a[0].substr(1); // remove /
	var modifier = '';
	while(r.substr(-1) != '/') 
	{
		modifier = r.substr(r.length-1);
		r = r.substr(0,r.length-1);
	}
	r = r.substr(0,r.length-1);
	var expr;
	try
		{ expr = new RegExp(r,modifier); }	
	catch (e)
		{ throw 'ERROR invalid regex '+ r;}
		if (expr.test(a[1])) return 1; else return ;
		};
	
	for(k in extentions)
	{
			try
			{
				var extentension = values[k];
				functions[k] = extension['fn'];
				arities[k] = extension['arity'];
			}
			catch (e)
			{
				throw new 'ERROR invalid extension '+ k;
			}			
	}	
	
	
	
	this.source = expression;
	this.result = '';
	this.rpn = compile(expression);
	
	
	
	function compile(expression)
	{		
		// add end character for regex
		var s = ' '+expression+' ;';	
		
		// protect quoted strings
		s = s.replace(/(")(.*?)(")/g, function (m0, m1, m2, m3) { return '#'+encodeURIComponent2(m2);});
		s = s.replace(/(')(.*?)(')/g, function (m0, m1, m2, m3) { return '#'+encodeURIComponent2(m2);});
		
		// protect regex
		while (/[\s]\/(.+?)\/([i]?)[\s]/.test(s))
		{	
			s = s.replace(/[\s]\/(.+?)\/([i]?)[\s]/, function (m0, m1, m2) {  return ' #'+encodeURIComponent2('/'+m1+'/'+m2)+' ';});
			
			//console.log(s);
		}
		
		if (s.match(/\s"|\'\s/,s)) throw 'ERROR unmatched quote';
		

		// protect floating
		s = s.replace(/\d+?\.\d+?/g, function (m0) { return '#'+encodeURIComponent2(m0);},s);

		
		// negative without space to identifier 
		// possible should be 5 + -4, 5 -4, -4 + 5, 5 + - 4
		while (/([-+/*]\s+)-(#\w+|\d+)/.test(s))  
			s = s.replace(/([-+/*]\s+)-(#\w+|\d+)/, '$1 $2 neg'); 
		s = s.replace(/^(\s+)-(#\w+|\d+)/, '$1 $2 neg'); 
		
		// functions
		
		while (/(\w*)\(([^\(]*?)\)/g.test(s) )
			s = s.replace(/(\w*)\(([^\(]*?)\)/,   // must parse here, regex does not work.
		
		function (m0, m1, m2) 
		{ 
			var mtrim = m2.trim();
			var engine = new swExpression(mtrim); 
			if (m1)
			{
				var list = engine.compilated().replace(' , ',',').split(',');
				if (m1.trim() == '') return list.join(' ');
					
				if (typeof functions[m1] === 'undefined') throw 'ERROR unknown function '+m1;
								
				if (arities[m1]== list.length) return list.join(' ')+' '+m1; 
				else if (arities[m1]=='') return list.join(' ')+' '+list.length+' '+m1; 
				else throw 'ERROR invalid arity '+m1+' '+list.length;
			}
			else
				return engine.compilated();
		} 
		,s); // end closure
		
		
		
		if  (/\(/.test(s)) throw 'ERROR unbalanced paranthesis (';
		if (/\)/.test(s)) throw 'ERROR unbalanced paranthesis )';
		
		
				
		var level = [];		
		level[0] = '\\*|\\/';
		level[1] = '\\+|\\-|\\.';
		level[2] = '!=|\\*=\\*|\\*=|=*\\|>=|<=|>=|<=|=|>|<|~~|\\*~\\*|\\*~|~\\*| eq | neq | reg | gt | ge | lw | le ';
		level[3] = ' and | or | xor ';
		//level[4] = ',';
		
		
		//console.log(level);
		var i;
		for (i=0;i<=3;i++)
		{
			var stopwords = level[i];
			var j;
			for (j=i+1;j<=3;j++)
				stopwords += '|'+level[j];
			stopwords += '|;|,';
			var p1 = '('+level[i]+')';
			var pattern1 = new RegExp( p1 );
			var p2 = '(.+?)('+level[i]+')(.*?)('+stopwords+')';
			var pattern2 = new RegExp(p2);
			
			var matches;
			while (pattern1.test(s))
			{				
				var s1 = s;
				
				
				
				s = s.replace(pattern2,
				function (m0, m1, m2, m3, m4)
				{
					
					var ops = {
					'*': 'mul',
					'/': 'div',
					'+': 'add',
					'-': 'sub',
					'=': 'equal',
					'.': 'concat',
					' eq ': 'equal',
					' reg ': 'regex',
					'!=': 'notequal',
					' neq ': 'notequal',
					'<': 'lower',
					' lw ': 'lower',
					'>': 'greater',
					' gt ': 'greater',
					'<=': 'lowerequal',
					' le ': 'lowerequal',
					'>=': 'greaterequal',
					' ge ': 'greaterequal',
					' and ': 'logand',
					' or ': 'logor',
					' xor ': 'logxor',
					};
					
					
										
					if (m1.trim() == '' || m3.trim() == '')  
						throw 'ERROR infix operator';
					

					if (m2.trim() == '') 
						return m2;
					else
						return m1+' '+m3+' '+ops[m2]+' '+m4;
					
					
				}					
				,s,1); // only once per match, always start over from beginning
				
				// no change. 
				if (s1 == s) throw 'ERROR infix operator';
				
								
			}
				
		}	
		
		try {
						
		// normalize spaces 
		while (/\s\s/.test(s))  s= s.replace(/\s\s/,' ');
				
		// remove end character for regex
		return s.substr(0,s.length-1).trim();
		
		}
		catch (e)
		{
			throw 'ERROR clean up';
		}
		
	}
	
	this.compilated = function(values)
	{
		return this.rpn;
	}
	
	this.evaluate = function(values)
	{
		var s = this.rpn;
		
		
		
		s = ' '+s+' ';
		
		
		
		// replace values
		var k;
		for(k in values)
		{
			var v = values[k];
			if (/\s\d+.?\d*\s/.test(' '+v+' '))
				while(s.indexOf(' '+k+' ') > -1)
					s = s.replace(' '+k+' ',' '+v+' ');
			else
				while(s.indexOf(' '+k+' ') > -1)
					s = s.replace(' '+k+' ',' #'+encodeURIComponent(v)+' ');

		}
		
		s = s.trim();
		
		var rpnvalues = s;

		var stack = [];
		var list = s.split(' ');
		
		//console.log(s);
		
		var el;
		for(el=0;el<list.length;el++)
		
		{
			var elem;
			elem = list[el];
			
			switch (elem.substr(0,1))
			{
				case '#' :  stack.push(String(decodeURIComponent(elem.substr(1)))); break;
				
				
				default:
				
				
				
				switch (elem) 
				{
									
					default: 	if (functions.hasOwnProperty(elem))
								{
									var c;
									if (arities.hasOwnProperty(elem))
										c = arities[elem];
									else
									{
										if (stack.length<1) throw 'ERROR empty stack';
										c = stack.pop();
									}
									if (stack.length<c) throw 'ERROR empty stack';
									var v = [];
									var i;
									for (i = 0; i < c; i++)
									{
										v.push(stack.pop());
									}
									var r = functions[elem](v);
									stack.push(r);
			
									
								}
								else
									
									if (/\s\d+\.?\d*\s/.test(" "+elem+" ") || elem =='')
									{
										//console.log(elem);
										stack.push(elem*1); // force number
									}
									else 
									
									
										throw 'ERROR unexpected term '+elem;
										
				
				} break;
				
				
				
				
			}
			
		}
		
		//console.log(stack);
		
		// stack should be empty now
		if (stack.length>1) throw 'ERROR unresolved terms';
		var result = stack.pop();
		
		//console.log(result);
		
		return result;
		
	}	
	
}

function swRelation(columns) {
	
	columns = columns.slice(); // force copy 
	var columns2;
	if (columns != ""){
		columns2 = array_unique(columns);
		check_identifiers(columns);
	}
	this.header = columns;
    this.tuples = [];
    this.arity =  function () { return this.header.length; } ;
    this.fieldseparator = "\t";
    this.insert = function (fields) {
		if (Array.isArray(fields)) {
			if (fields.length != this.header.length)
				throw "insert error: column count "+fields.length+" != "+this.header.length;
			fields = fields.join(this.fieldseparator);
		}
		var rest = replace_all(fields,this.fieldseparator,"");
		var fieldcount = fields.length - rest.length + 1;
		if  (fieldcount != this.header.length)
			throw "insert error: column count "+fieldcount+" != "+this.header.length;
		if (this.tuples.indexOf(fields)<0) {
			this.tuples.push(fields);
		}
	};
	
	
	this.del = function(cond){
		var rest = this.difference(this.select(cond));
		this.tuples = rest.tuples.slice();
	};
	this.update = function(cond, lbl, expr){
		var upd = this.select(cond);
		var header = this.header.slice();
		var rest = this.difference(upd);
		upd = upd.extend(lbl+"_EXTEND",expr).rename([lbl+" "+lbl+"_OLD",lbl+"_EXTEND "+lbl]).project(header);
		this.tuples = rest.union(upd).tuples.slice();		
	};
	this.print = function() {
		// pretty
		// check length of header and first line
		//
		var widths = {};
		var tuple = '';
		var i;
		
		for (i in this.header)
		{
			widths[i] = this.header[i].length
		}
		if (this.tuples.length>0)
		{
			for (var t in this.tuples){
				tuple = this.tuples[t];
				tuple = tuple.split(this.fieldseparator); //need to pad
				while (tuple.length < this.header.length) tuple.push('');	
				for (i in this.header)
				{
					widths[i] = Math.max(widths[i],tuple[i].length);
				}
			}
		}		
		var firstline = '┌';
		for(i in widths) { firstline = firstline + '─'.repeat(widths[i]+2) + '┬' ; }
		firstline = firstline.substr(0,firstline.length-1)+'┐';
		console.log(firstline);

		var line = '│';
		for(i in widths) { line = line + ' '+ (this.header[i]+' '.repeat(widths[i]) ).substr(0,widths[i])+' '+ '│'; }
		console.log(line);
		var inline = firstline.replace('┌','├').replace(/┬/g,'┼').replace('┐','┤');
		for (var t in this.tuples){
			console.log(inline);
			tuple = this.tuples[t].split(this.fieldseparator);
			line = '│'; 
			for(i in widths) { line = line + ' '+ (tuple[i]+' '.repeat(widths[i]) ).substr(0,widths[i])+' '+ '│'; }
			console.log(line);
		}
		var lastline = firstline.replace('┌','└').replace(/┬/g,'┴').replace('┐','┘');
		console.log(lastline);
	};
	this.toTab = function() {
		var result = this.header.join(this.fieldseparator)+"\n"+this.tuples.join("\n");
		return result;
	};
	this.fromTab = function(tabstring) {
		tabstring = replace_all(tabstring, "\r\n","\n");
		tabstring = replace_all(tabstring, "\r","\n");
		var lines = tabstring.split("\n");
		var columns = lines[0].split(this.fieldseparator).map(function(s) {return fix_identifier(s.trim());} );
		if (columns == "") return; // empty swRelation
		check_identifiers(columns);
		var result = new swRelation(columns);
		for (var t in lines){
			if (t > 0 && lines[t] != '')
				result.insert(lines[t].split(result.fieldseparator));
		}
		return result;
	};
	this.toCSV = function() {
		var result = this.header.join(',')+"\n";
		var lines = [];
		for(t in this.tuples)
		{
			var fields = this.tuples[t].split(this.fieldseparator);
			var line = [];
			for (f in fields)
			{
				var v = fields[f]
				
				if (/\s\d+\.?\d*\s/.test(" "+v+" "))
					line.push(v);
				else
				{
					line.push('"'+v.replace('"','""')+'"');
				}
				
			}
			lines.push(line);
			
		}
		result = result + lines.join("\n");
		return result;
	};
	this.fromCSV = function(source) {
		var arr = parseCSV(source)
		var line = '';
		
		var columns = arr.shift().map(function(s) {return fix_identifier(s.trim());} );		
		check_identifiers(columns);
		var result = new swRelation(columns);
		while (arr.length > 0)
		{
			result.insert(arr.shift());
		}
		return result;
		
	};
	this.select = function(cond){
		var result = new swRelation(this.header);
		
		try { var expr = new swExpression(cond); }
		catch (e) { throw "select compilation error: "+ cond+" "+e; }
		
		for (var t in this.tuples) {
		
			var tuple = this.tuples[t];
			var fields = tuple.split(this.fieldseparator);
			var parameters = {};
			for (var f in this.header)
			{
				parameters[this.header[f]] = fields[f];
			}
			
			//console.log(parameters);
			
			try { 
				if (expr.evaluate(parameters) == 1) result.insert(fields);
				
			}
			catch (e) { throw "select evaluation error: "+ cond+" "+e; }
		
		}
		return result;
	};
	this.project = function(columns){
		newcolumns = array_unique(columns).map(function(s) {return s.trim().replace(" ","_");} );
		var result = new swRelation(newcolumns);
		var cols = [];
		var hasstats = false;
		var c;
		var col;
		var t;
		var fields;
		var key;
		var ck;
		var a;
		for (c in columns){
			col = columns[c].split(" ");
			
			cols[c] = -1;
			for (var tc in this.header) {
				if ( col[0] == this.header[tc]){
					cols[c] = tc;
				}
			}			
			if (cols[c] < 0) throw "project error: column missing "+columns[c];
			
			if (col.length>1) {		
				if (col.length>2) throw "project error: invalid column "+columns[c];
				hasstats = true;
			}
		}
		
		
		
		var stats = {};
		for (t in this.tuples){
			var resultfields = [];
			var statfields = [];
			var tuple = this.tuples[t];
			fields = tuple.split(this.fieldseparator);
			for (c in columns){
				col = columns[c].split(" ");
				if (col.length > 1){
					resultfields[c] = "";
					statfields[c] = fields[cols[c]];
				}
				else {
					resultfields[c] = fields[cols[c]];
					statfields[c] = "";
				}
			}
			
			result.insert(resultfields);
			key = resultfields.join(this.fieldseparator);
			for (c in columns) {
				col = columns[c].split(" ");
				if (col.length > 1){
					ck = key+this.fieldseparator+columns[c];
					if (!stats.hasOwnProperty(ck)) {
						stats[ck] = [];
					}
					stats[ck].push(statfields[c]);
					
				}
			}
		}
		
		if (hasstats)
		for (t in result.tuples) {
			fields = result.tuples[t].split(this.fieldseparator);
			key = fields.join(this.fieldseparator);
			for (c in columns){
				col = columns[c].split(" ");
				if (col.length>1) {
					ck = key+this.fieldseparator+columns[c];
					if (!stats.hasOwnProperty(ck)) throw "project error: stat missing "+ck;
					var arr = stats[ck];
					if (!Array.isArray(arr)) throw "project error: stat not array "+ck;
					var v="";
					switch (col[1].toLowerCase()) {
						case "count":
							v=0;
							for (a in arr){
								if (arr[a] != "") v+=1;
							}
							break;
						case "sum":
							v=0;
							for (a in arr){
								if (arr[a] != "") v+=arr[a]*1;
							}
							break;
						case "avg":
							v=0;
							var vd=0;
							for (a in arr){
								if (arr[a] != "") {
									vd+=1;
									v+=arr[a]*1;
								}
							}
							if (vd>0)
								v = v / vd;
							else
								v = "";
							break;
						case "min":
							v="";
							for (a in arr){
								if (v=="") v = arr[a];
								if (arr[a]<v) v= arr[a];
							}
							break;
						case "max":
							
							v="";
							for (a in arr){
								if (v=="") v = arr[a];
								if (arr[a]>v) v= arr[a];
							}
							break;
						case "median":
						
								arr.sort(function (a, b) { return a - b; });
								
								if (arr.length % 2 > 0) {
									v = arr[(arr.length+1)/2];
								}
								else {
									v = (arr[arr.length/2] + arr[arr.length/2+1])/2;
								}
								break;
						
						default : throw "project error: invalid operator "+col[1];
					}
					fields[c] = v;
				}
				result.tuples[t]=fields.join(this.fieldseparator);
			} 
			
		}
		
		
		if (result.tuples.length == 0 && hasstats) {
			fields=[];
			var v1;
			for (c in columns) {
				col = columns[c].split(" ");
				if (col.length > 1) {
					switch (col[1]){
						case "count": 
						case "sum": v1=0; break;
						case "avg":
						case "min":
						case "max":
						case "median": v1=""; break;
						default : throw "project error: invalid operator "+col[1];			
					}
					fields[c] = v1;
				}
			}
			result.insert(fields);
		}		
		return result;
	};
	this.rename = function(columns) {
		columns = array_unique(columns).map(function(s) {return s.trim();} );
		var result = new swRelation(this.header);
		for (var t in this.tuples){
			result.insert(this.tuples[t]);
		}	
		for (var c in columns){
			var pair = columns[c];
			var fields = pair.split(" ");
			if (fields.length != 2) throw "rename error: invalid format "+pair;
			check_identifiers(fields);
			var found = false;
			for (var tc in result.header) {
				if (fields[0] == result.header[tc]){
					result.header[tc] = fields[1];
					found = true;
				}
			}
			if (!found) throw "rename error: column missing "+fields[0];
		}
		return result;
	};
	this.extend = function(lbl, expr){
		var result = new swRelation(this.header);
		result.header.push(lbl);
		check_identifiers(result.header);
		
		try { var expr = new swExpression(expr); }
		catch (e) { throw "extend compilation error: "+ expr+" "+e; }
		
		for (var t in this.tuples) {
			
			var tuple = this.tuples[t];
			var fields = tuple.split(this.fieldseparator);
			var parameters = {};
			for (var f in this.header)
			{
				parameters[this.header[f]] = fields[f];
			}
			
			//console.log(parameters);
			
			try { 
				var s = expr.evaluate(parameters);
				fields.push(s);
				result.insert(fields);
				
			}
			catch (e) { throw "extend evaluation error: "+ expr+" "+e; }

		}
		return result;
	};
	this.union = function(rel) {
		if (this.arity() != rel.arity()) {
			throw "union error: arity " + this.arity +" != "+rel.arity;
		}
		var result = rel.project(this.header);
		for (var t in this.tuples) {
			result.insert(this.tuples[t]);
		}
		return result;
	};
	this.difference = function(rel) {
		if (this.arity() != rel.arity()) {
			throw "difference error: arity " + this.arity +" != "+rel.arity;
		}
		var result = new swRelation(this.header);
		var rel2 = rel.project(this.header);
		for (var t in this.tuples) {
			var tuple = this.tuples[t];
			if (rel2.tuples.indexOf(tuple)<0) {
				result.insert(tuple);
			}
		}
		return result;
	};
	this.join = function(rel, cond) {
		if (cond.toUpperCase() == "RIGHTSEMI") return rel.join(this,"LEFTSEMI");
		if (cond.toUpperCase() == "RIGHTANTI") return rel.join(this,"LEFTANTI");
		if (cond.toUpperCase() == "RIGHT") return rel.join(this,"LEFT");
		if (cond.toUpperCase() == "OUTER") return this.join(rel,"LEFT").union(this.join(rel,"RIGHT"));
		var result = new swRelation(this.header);
		var commoncols = [];
		var othercols = [];
		for (var rc in rel.header){
			var col = rel.header[rc];
			if (result.header.indexOf(col) > -1) {
				if (result.header.indexOf(col+"_2") > -1) throw "join error duplicate column "+col+"_2";
				result.header.push(col+"_2");
				commoncols.push(col);
			}
			else {
				result.header.push(col);
				othercols.push(col);
			}
		}
		
		var newproject = [];
		var anti = false;
		var outerleft = false;
		var outerright = false;
		if (cond.toUpperCase() == "LEFT") outerleft = true;
		if (cond.toUpperCase() == "RIGHT") outerright = true;
		if (cond.toUpperCase() == "OUTER") {outerleft = true; outerright = true;}
		
		//console.log(cond);
		//console.log(cond.toUpperCase());
		
		switch(cond.toUpperCase()){
			case "LEFTANTI": anti = true; break; 
			case "NATURAL":
			case "LEFT":
			case "RIGHT":
			case "OUTER":
			case "LEFTSEMI":
				var terms = [];
				newproject = result.header.slice();
				for( var c in commoncols){
					terms.push(commoncols[c] + " = " + commoncols[c] + "_2");
				}
				
				switch(cond.toUpperCase()) {
					case "LEFTSEMI": 
					case "LEFTANTI":
						newproject = this.header.slice();
						cond = terms.join(" and ");
						break;		 			
					case "LEFT":
					case "RIGHT":
					case "OUTER":
					case "NATURAL": 
						newproject = this.header.slice().concat(othercols);
						cond = terms.join(" and ");
						break;
					default:
					
				}
					
				break;
				
		
				default : //cond = cond
				
		}
		
		try { var expr = new swExpression(cond); }
		catch (e) { throw "select compilation error: "+ cond+" "+e; }
		
		for (var t in this.tuples){
			var tuple = this.tuples[t];
			for (var rt in rel.tuples){
				var reltuple = rel.tuples[rt];
				var fields = (tuple+this.fieldseparator+reltuple).split(this.fieldseparator);
				
			//	console.log(fields);
			//	console.log(result.header);
				
				var parameters = {};
				for (var f in result.header)
				{
					parameters[result.header[f]] = fields[f];
				}
			
			//	console.log(parameters);
			
				try { 
					if (expr.evaluate(parameters) == 1) result.insert(fields);
				
				}
				catch (e) { throw "select evaluation error: "+ cond+" "+e; }
				
				/*
				var script = "{";
				for (var f in result.header)
					script += result.header[f] + " = \"" + resulttuple[f] + "\"; ";
				script += "expr = (" + cond + "); }";
				try { 
					if (evaluate(script))
						result.insert(resulttuple);
				}
				catch (e) {
					throw "join error: "+ script+" "+e;
				}
				*/
			}
		}
		
		if (newproject.length > 0)
			result = result.project(newproject);
			
		if (anti)
			result = this.difference(result);
		var rest;
		var comp;
		
		if (outerleft){
			rest = this.difference(result.project(this.header));
			comp = this.fieldseparator.repeat(result.header.length - this.header.length);
			for (t in rest.tuples){
				result.insert(rest.tuples[t] + comp);
			}
		}
		
		if (outerright){
			rest = this.difference(result.project(rel.header));
			comp = this.fieldseparator.repeat(result.header.length - rel.header.length);
			for (t in rest.tuples){
				result.insert(rest.tuples[t] + comp);
			}
		}
		
		return result;
		
	};
	
	this.order = function (columns){
		columns = array_unique(columns).map(function(s) {return s.trim();} );
		var result = new swRelation(this.header);
		result.tuples = this.tuples.slice();
		var header = this.header;
		var fieldseparator = this.fieldseparator;
		result.tuples.sort( function(at,bt) {
			var afields = at.split(fieldseparator);
			var bfields = bt.split(fieldseparator);
			for (var c in columns){
				var cols = columns[c].split(" ");
				var order = "A";
				if (cols.length>1) order = cols[1];
				var found = false;
				for (var tc in header){
					if (cols[0] == header[tc]){
						found = true;
						var a = afields[tc];
						var b = bfields[tc];
						switch (order){
							case "Z":
								if (a.toString()< b.toString()) return 1;
								if (a.toString()> b.toString()) return -1;
								break;
							case "A":
								if (a.toString()> b.toString()) return 1;
								if (a.toString()< b.toString()) return -1;
								break;
							case "z":
								if (a.toLowerCase()< b.toLowerCase()) return 1;
								if (a.toLowerCase()> b.toLowerCase()) return -1;
								break;
							case "a":
								if (a.toLowerCase()> b.toLowerCase()) return 1;
								if (a.toLowerCase()< b.toLowerCase()) return -1;
								break;
							
							case "9":
								if (a*1 < b*1) return 1;
								if (a*1 > b*1) return -1;
								break;
							case "1":
								if (a*1 > b*1) return 1;
								if (a*1 < b*1) return -1;
								break;
							default: throw "order error: invalid operator "+order;
						}
					}
				}
				if (!found) throw "order error: invalid column "+cols[0];
			} return 0;
		} );
		return result;
	
	};
	
	this.limit = function(start, length){
	
		
		if (start==0) throw "limit error: invalid start "+start;
		if (start<0) start =this.tuples.length-start-1;
		if (length=="") length = this.tuples.length;
		if (length<0) throw "limit error: invalid length "+length;
		var result = new swRelation(this.header);
		result.tuples = this.tuples.slice(start-1, start+length-1);
		return result;
	
	};
	
	
}



if (process.argv.length > 2 && process.argv[2] == '-t')
{
var films
var newfilms 
var oldfilms
var titles
var years
var freitag
var allfilms
var fewfilms
var list2
var ua
var cross
var morefilms
var directors


films = new swRelation(["title","year"])
films.insert(["home",2007])
films.insert(["hiver nomade",2012])
films.print()
films.insert(["home",2007])
films.insert(["star wars",2007])
films.insert(["Home",2007])
films.print()

newfilms = films.select("year > 2008")
newfilms.print()
oldfilms = films.select("year < 2010")
oldfilms.print()
titles = films.project(["title"])
titles.print()
years = films.project(["year"])
years.print()
freitag = films.rename(["year freitag"])
freitag.print()
morefilms = new swRelation(["title","year"])
morefilms.insert(["home",2007])
morefilms.insert(["l'escale",2013])
allfilms = films.union(morefilms)
// allfilms.print()
fewfilms = films.difference(morefilms)
// console.log( "few")
// fewfilms.print()
directors = new swRelation(["name","title"])
directors.insert(["Ursula Meier","home"])
directors.insert(["Manuel von Stürler","hiver nomade"])
directors.insert(["Stina Werenfels","Nachbeben"])
// directors.print()
// list = films.join(directors,"title == title_2")
// list.print()

list2 = films.join(directors,"NATURAL")
console.log("--list2--")
// list2.print()

list2 = films.join(directors,"OUTER")
console.log("--list2 outer--")
// list2.print()

list2 = films.join(directors,"RIGHTANTI")
// console.log("--list2 anti--")
// list2.print()



cross = films.join(directors,"true")
// cross.print()
// lm = cross.limit(-1,1)
// lm.print()
ua = cross.order(["title a"])
// ua.print()

// ua.del("year == 2007")
 ua.print() 

cross.update("year == 2007","year","year*2")
 cross.print()
 group = cross.project(["title","year COUNT","year SUM","year AVG"])
 group.print()
 all = group.project(["title COUNT","year_COUNT SUM"])
 all.print()
// norecords = new swRelation(["title"])
// norecords.print()
// nostats = norecords.project(["title COUNT","title AVG"])
// nostats.print()
// med = cross.project(["year MEDIAN"])
// med.print()
// nextfilms = films.extend("next","year*1+2")
// nextfilms.print()
// 
// nogoods = films.project(["ng"])
// nogoods = titles.select("=€3((3)")
}


