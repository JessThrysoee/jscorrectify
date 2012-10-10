#!/bin/sh
#
# jscorrectify - jshint[1], jslint[2], jsbeautifier[3], and cssbeautify[4] command-line interfaces.
#
# [1]: http://jshint.com
# [2]: http://jslint.com
# [3]: http://jsbeautifier.org
# [4]: https://github.com/senchalabs/cssbeautify
# 
# Copyright (c) 2010 Jess Thrysoee (jess@thrysoee.dk)
# Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
#

PREFIX=/usr/local2
# install dir for executables (should be on PATH)
BINDIR=$(PREFIX)/bin
# install dir for *.js
DATAROOTDIR=$(PREFIX)/share/jscorrectify


NAME=jscorrectify-1.0


LINT_CL=lint-cl.js
JSBEAUTIFY_CL=jsbeautify-cl.js
CSSBEAUTIFY_CL=cssbeautify-cl.js

JSHINT=jshint.js
JSLINT=jslint.js
JSBEAUTIFY=beautify.js
CSSBEAUTIFY=cssbeautify.js
RHINO=js.jar
ENV_JS=env.js
GENERATED=jshint jslint jsbeautify cssbeautify jscorrectify



all: $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO)


$(JSHINT): $(GENERATED)
	@$(SHELL) ./jscorrectify init jshint

$(JSLINT): $(GENERATED)
	@$(SHELL) ./jscorrectify init jslint

$(JSBEAUTIFY): $(GENERATED)
	@$(SHELL) ./jscorrectify init jsbeautify

$(CSSBEAUTIFY): $(GENERATED)
	@$(SHELL) ./jscorrectify init cssbeautify


$(RHINO):
	curl -O ftp://ftp.mozilla.org/pub/mozilla.org/js/rhino1_7R3.zip
	unzip -jo rhino1_7R3.zip rhino1_7R3/js.jar


jshint:
	sed -e '1,$$s;@datarootdir@;$(DATAROOTDIR);g' -e '1,$$s;@lint@;jshint;g' lint.in > $@
jslint:
	sed -e '1,$$s;@datarootdir@;$(DATAROOTDIR);g' -e '1,$$s;@lint@;jslint;g' lint.in > $@
jsbeautify cssbeautify jscorrectify:
	sed '1,$$s;@datarootdir@;$(DATAROOTDIR);g' $@.in > $@



install: all $(LINT_CL) $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL)
	mkdir -p $(DATAROOTDIR)
	cp -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO) $(LINT_CL) $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL) $(ENV_JS) $(DATAROOTDIR)
	mkdir -p $(BINDIR)
	cp -f $(GENERATED) $(BINDIR)
	cd $(BINDIR) && chmod +x $(GENERATED)



uninstall:
	cd $(DATAROOTDIR) && rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO) $(LINT_CL) $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL) $(ENV_JS)
	-rmdir $(DATAROOTDIR)
	rm -f $(BINDIR)/jslint
	rm -f $(BINDIR)/jsbeautify
	rm -f $(BINDIR)/jscorrectify
	-rmdir $(BINDIR)



clean:
	rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(CSSBEAUTIFY) $(GENERATED)
distclean:
	rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(CSSBEAUTIFY) $(GENERATED) $(RHINO) rhino1_7R3.zip $(NAME).tar.gz



dist:
	mkdir -p dist/$(NAME)
	cp jsbeautify.in     dist/$(NAME)
	cp jscorrectify.in   dist/$(NAME)
	cp lint.in           dist/$(NAME)
	cp $(LINT_CL)        dist/$(NAME)
	cp $(JSBEAUTIFY_CL)  dist/$(NAME)
	cp $(CSSBEAUTIFY_CL) dist/$(NAME)
	cp $(ENV_JS)         dist/$(NAME)
	cp Makefile          dist/$(NAME)
	cd dist && tar zcvf ../$(NAME).tar.gz $(NAME)
	rm -r dist



.PHONY: all install uninstall clean distclean dist

