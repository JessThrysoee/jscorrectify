# jscorrectify

Makes the github HEAD of [jshint](http://github.com/jshint/jshint), [jslint](http://github.com/douglascrockford/JSLint), and [jsbeautify](http://github.com/einars/js-beautify) available as command-line commands.

Once installed, `jscorrectify` makes it easy to `--upgrade` to the current HEAD of the respective scripts and `--diff` any changes since the last upgrade.

Lint errors are compatible with [vim](http://www.vim.org)'s errorformat, so they can be shown and navigated in a quickfix window.


System requirements: java and curl.

###Example

Beautify the javascript file `myscript.js` with an indent level of three spaces:

    $ jsbeautify jslint_happy=true,indent_size=3 myscript.js

and then lint it:

    $ jshint white=true,indent=3,browser=true myscript.js


Review and upgrade any improvements to e.g. jshint:

    $ jscorrectify --diff jshint
    $ jscorrectify --upgrade jshint
    

###Usage

    $ jslint --help
    usage: jslint [opt1=val1,opt2=val2...] FILE
 
    $ jshint --help
    usage: jshint [opt1=val1,opt2=val2...] FILE
 
    $ jsbeautify --help
    usage: jsbeautify [opt1=val1,opt2=val2...] FILE
 
    $ jscorrectify --help
    usage: jscorrectify --diff     <jshint|jslint|jsbeautify>
           jscorrectify --upgrade  <jshint|jslint|jsbeautify>
           jscorrectify --help

###Vim
A minimal `.vimrc` for javascript editing could look like:

    set nocompatible
    syntax on
    filetype plugin indent on
    autocmd FileType javascript call JavascriptFileType()

    function JavascriptFileType()
       setlocal expandtab
       setlocal shiftwidth=3 tabstop=3 softtabstop=3

       "vim >= 7.3 javascript indent
       setlocal cinoptions+=J1

       "jshint
       setlocal makeprg=jshint\ white=true,indent=3,browser=true\ %
       setlocal errorformat=jshint:%f:%l:%c:%m

       "F5 runs jshint on this file, with errors shown in quickfix window
       nmap <buffer> <F5> :make<CR>

       "jsbeautify
       setlocal equalprg=jsbeautify\ jslint_happy=true,indent_size=3\ %

       "F10 runs jsbeautify on this file
       nmap <buffer> <F10> m`gg=G``
    endfunction

With this `F10` beautifies the javascript file and `F5` lints it.
