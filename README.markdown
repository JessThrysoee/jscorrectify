# jscorrectify

Makes the github HEAD of [jsbeautify](http://github.com/einars/js-beautify) and [cssbeautify](https://github.com/senchalabs/cssbeautify) available as command-line commands.

Once installed, `jscorrectify` makes it easy to `upgrade` to the current HEAD of the respective scripts and `diff` any changes since the last upgrade.


System requirements: java and curl.

###Example

Beautify the javascript file `myscript.js` with an indent level of three spaces:

    $ jsbeautify -o indent_size=3 myscript.js

or beautify a CSS file:

    $ cssbeautify -o indent='   ' mystyle.css


Review and upgrade any improvements to e.g. jsbeautify:

    $ jscorrectify diff jsbeautify
    $ jscorrectify upgrade jsbeautify
    

###Usage

    $ jsbeautify help
    usage: jsbeautify [-o opt1=val1,opt2=val2...] [FILE]

    $ cssbeautify help
    usage: cssbeautify [-o opt1=val1,opt2=val2...] [FILE]
 
    $ jscorrectify help
    usage: jscorrectify diff     <jsbeautify|cssbeautify>
           jscorrectify upgrade  <jsbeautify|cssbeautify|all>
           jscorrectify outdated
           jscorrectify help

###Vim
A minimal `.vimrc` for javascript editing could look like:

    set nocompatible
    syntax on
    filetype plugin indent on

    " JS
    autocmd FileType javascript call JavascriptFileType()

    function JavascriptFileType()
       setlocal expandtab
       setlocal shiftwidth=3 tabstop=3 softtabstop=3

       "vim >= 7.3 javascript indent
       setlocal cinoptions+=J1

       "jshint
       setlocal makeprg=jshint\ --verbose\ --show-non-errors\ %
       setlocal efm=%f:\ line\ %l\\,\ col\ %c\\,\ %m

       "F5 runs jshint on this file, with errors shown in quickfix window
       nmap <buffer> <F5> :make<CR>

       "jsbeautify
       setlocal equalprg=jsbeautify\ -o\ indent_size=3

       "F10 runs jsbeautify on this file
       nmap <buffer> <F10> m`gg=G``
    endfunction


    " CSS
    autocmd FileType css call CSSFileType()

    function! CSSFileType()
       setlocal equalprg=cssbeautify\ -o\ indent='\ \ \ '
    endfunction


    " reload chrome tab
    function! TellChromeReloadActiveTab()
       silent !osascript -e 'tell application id "com.google.Chrome" to reload active tab of window 1' &
       redraw!
    endfunction

    nmap <F2> m`:call TellChromeReloadActiveTab()<CR>``


With this `F10` beautifies javascript and css files and `F5` lints javascript files.

While you are messing with your vim setup, have a look at:

* [ctrl-p](https://github.com/kien/ctrlp.vim)
* [tagbar](https://github.com/majutsushi/tagbar)
* [doctorjs](https://github.com/mozilla/doctorjs)

With these nothing can stop you from coding the next big javascript library.
