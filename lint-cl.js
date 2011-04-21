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

/*jslint rhino: true */

(function (global, args) {
    var LINT,
        lint   = args[0], // jshint or jslint
        file   = args[1],
        optstr = args[2], // arg1=val1,arg2=val2,...
        opts   = {},
        input;

    if (!file) {
        print('usage: lint-cl.js <jshint|jslint> FILE.js [arg1=val1,arg2=val2...]');
        quit(1);
    }

    if (optstr) {
        optstr.split(',').forEach(function (arg) {
            var o = arg.split('=');
            opts[o[0]] = (function (ov) {
                switch (ov) {
                case 'true':
                    return true;
                case 'false':
                    return false;
                default:
                    return ov;
                }
            })(o[1]);
        });
    }

    input = readFile(file);

   if (!input) {
      print(lint + ': couldn\'t open file ' + file);
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

}(this, arguments));
