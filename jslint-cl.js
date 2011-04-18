/*!
 * jscorrectify - jslint[1] and jsbeautifier[2] command-line interfaces.
 *
 * [1]: http://jslint.com
 * [2]: http://jsbeautifier.org
 * 
 * Copyright (c) 2010 Jess Thrysoee (jess@thrysoee.dk)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * This is the Rhino companion to jslint.js, originally based on
 * Douglas Crockford's rhino.js
 */


/*global JSLINT, importPackage, BufferedReader, InputStreamReader, System, java */
/*jslint rhino: true */


(function (a) {
   var e, i, input, file, stdin, lines, options, f, data;

   input = '';
   file = a[0] || '';

   if (file) {
      // file or URL
      if (file.match(/^https?/)) {
         input = readUrl(file);
         print(input);
      } else {
         input = readFile(file);
      }
      if (!input) {
         print("jslint: Couldn't read '" + file + "'.");
         quit(1);
      }
   } else {
      // filter stdin
      importPackage(java.io);
      importPackage(java.lang);
      stdin = new BufferedReader(new InputStreamReader(System['in']));
      lines = [];

      while (stdin.ready()) {
         lines.push(stdin.readLine());
      }
      if (lines.length) {
         input = lines.join("\n");
      }
   }
   input = input.replace(/^\s+/, '');

   if (!input) {
      print("usage: jslint.js FILE");
      print("       jslint.js URL");
      print("       jslint.js < FILE");
      print("       echo 'SCRIPT' | jslint.js");
      quit(1);
   }


   function printFunction(f, postfix) {
      var str;
      str = 'function@' + f.line + '-' + f.last + ' ' + f.name.replace('"', '', 'g') + ' (';
      if (f.param) {
         str += f.param.join();
      }
      str += ') ' + postfix;

      print(str);
   }

   function printArray(prefix, A) {
      if (A) {
         print(prefix + ': ' + A.join());
      }
   }

   function printMember(prefix, member) {
      var k, A = [];
      if (member) {
         for (k in member) {
            if (Object.prototype.hasOwnProperty.call(member, k)) {
               A.push(k + ':' + member[k]);
            }
         }
         printArray(prefix, A);
      }
   }

   function printNameLine(prefix, A) {
      var i, T = [];
      if (A) {
         for (i = 0; i < A.length; i++) {
            T.push(' ' + A[i].name + ':' + A[i].line);
         }
         printArray(prefix, T);
      }
   }

   options = {
      bitwise: true,
      eqeqeq: true,
      immed: true,
      newcap: true,
      nomen: true,
      onevar: true,
      regexp: true,
      undef: true,
      white: true,
      browser: true,
      indent: 3
   };

   if (!JSLINT(input, options)) {
      for (i = 0; i < JSLINT.errors.length; i += 1) {
         e = JSLINT.errors[i];
         if (e) {
            print('jslint:' + file + ':' + e.line + ':' + e.character + ': ' + e.reason);
            print((e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1"));
            print('');
         }
      }
      quit(2);

   } else {
      print("jslint: No problems found" + (file ? (' in ' + file) : '') + '.');

      data = JSLINT.data();
      if (data) {
         if (data.errors) {
            throw "unexpected errors";
         }
         if (data.functions) {
            for (i = 0; i < data.functions.length; i += 1) {
               f = data.functions[i];
               printFunction(f, '{');

               printArray('   closure', f.closure);
               printArray('   var', f['var']);
               printArray('   exception', f.exception);
               printArray('   outer', f.outer);
               printArray('   unused', f.unused);
               printArray('   global', f.global);
               printArray('   label', f.label);
               print('}');
            }
         }
         printArray('globals', data.globals);
         printMember('members', data.member);

         printNameLine('unuseds', data.unuseds);
         printNameLine('implieds', data.implieds);

         printArray('urls', data.urls);
         if (data.json) {
            print('json: ' + data.json);
         }

      }
   }

}(arguments));
