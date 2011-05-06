/*!
 * jscorrectify - jshint[1], jslint[2], and jsbeautifier[3] command-line interfaces.
 *
 * [1]: http://jshint.com
 * [2]: http://jslint.com
 * [3]: http://jsbeautifier.org
 *
 * Copyright (c) 2010 Jess Thrysoee (jess@thrysoee.dk)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 * This is the Rhino companion to jslint.js, originally based on
 * Douglas Crockford's rhino.js
 */

/*jslint rhino:true */

(function (global, args) {
   var lint, file, input, optstr, opts = {};

   lint = args.shift(); // jshint or jslint

   (function () {
      var i, l;
      for (i = 0, l = args.length; i < l; i++) {
         if (args[i] === '-o') {
            if (i + 1 < l) {
               optstr = args[++i]; // arg1=val1,arg2=val2,...
            }
         } else if (i + 1 === l) {
            file = args[i];
         } else {
            print('jsbeautify: error passing args');
            quit(1);
         }
      }
   }());

   function readStdin() {
      var stdin, lines, input;
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
      if (!lines.length) {
         print('jsbeautify: error reading stdin');
         quit(1);
      }
      input = input.replace(/^\s+/, '');
      return input;
   }

   if (optstr) {
      optstr.split(',').forEach(function (arg) {
         var o = arg.split('=');
         opts[o[0]] = (function (ov) {
            if (ov === 'true') {
               return true;
            } else if (ov === 'false') {
               return false;
            } else if (!isNaN(ov - 0)) {
               return +ov; // Number
            } else {
               return ov;
            }
         }(o[1]));
      });
   }

   if (file) {
      input = readFile(file);
   } else {
      input = readStdin();
   }

   if (!input) {
      print('usage: ' + lint + ' [-o arg1=val1,arg2=val2...] [FILE.js]');
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

   // main
   (function () {
      var LINT, i, e, f, data;

      LINT = global[lint.toUpperCase()];

      if (!LINT(input, opts)) {
         for (i = 0; i < LINT.errors.length; i += 1) {
            e = LINT.errors[i];
            if (e) {
               print(lint + ':' + file + ':' + e.line + ':' + e.character + ': ' + e.reason);
               print((e.evidence || '').replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1'));
               print('');
            }
         }
         quit(2);

      } else {
         print(lint + ': No problems found' + (file ? (' in ' + file) : '') + '.');
         print('');

         data = LINT.data();
         if (data) {
            if (data.errors) {
               throw 'unexpected errors';
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
   }());

}(this, arguments));
