/*

 CSS Beautifier Rhino command line script
----------------------------------------
*/

/*global java, importPackage, BufferedReader, InputStreamReader, System */
/*jslint rhino:true */

(function (args) {
   var file, input, optstr, opts = {};

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
            print('cssbeautify: error passing args');
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
         print('cssbeautify: error reading stdin');
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
      print('cssbeautify: couldn\'t open file ' + file);
      quit(1);
   }

   //print(cssbeautify(input, opts));
   print(cssbeautify(input));

}(arguments));
