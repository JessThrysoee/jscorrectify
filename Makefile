#!/bin/sh
#
# jscorrectify - jsbeautifier[3], and cssbeautify[4] command-line interfaces.
#
# [3]: http://jsbeautifier.org
# [4]: https://github.com/senchalabs/cssbeautify
# 
# Copyright (c) 2010 Jess Thrysoee (jess@thrysoee.dk)
# Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
#

PREFIX=/usr/local
# install dir for executables (should be on PATH)
BINDIR=$(PREFIX)/bin
# install dir for *.js
DATAROOTDIR=$(PREFIX)/share/jscorrectify


NAME=jscorrectify-1.0

JSBEAUTIFY_CL=jsbeautify-cl.js
CSSBEAUTIFY_CL=cssbeautify-cl.js

JSBEAUTIFY=beautify.js
CSSBEAUTIFY=cssbeautify.js
RHINO=js.jar
ENV_JS=env.js
GENERATED=jsbeautify cssbeautify jscorrectify



all: $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO)


$(JSBEAUTIFY): $(GENERATED)
	@$(SHELL) ./jscorrectify init jsbeautify

$(CSSBEAUTIFY): $(GENERATED)
	@$(SHELL) ./jscorrectify init cssbeautify


$(RHINO):
	curl -L -O https://github.com/downloads/mozilla/rhino/rhino1_7R4.zip
	unzip -jo rhino1_7R4.zip rhino1_7R4/js.jar


jsbeautify cssbeautify jscorrectify:
	sed '1,$$s;@datarootdir@;$(DATAROOTDIR);g' $@.in > $@



install: all $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL)
	mkdir -p $(DATAROOTDIR)
	cp -f $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO) $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL) $(ENV_JS) $(DATAROOTDIR)
	mkdir -p $(BINDIR)
	cp -f $(GENERATED) $(BINDIR)
	cd $(BINDIR) && chmod +x $(GENERATED)



uninstall:
	cd $(DATAROOTDIR) && rm -f $(JSBEAUTIFY) $(CSSBEAUTIFY) $(RHINO) $(JSBEAUTIFY_CL) $(CSSBEAUTIFY_CL) $(ENV_JS)
	-rmdir $(DATAROOTDIR)
	rm -f $(BINDIR)/jsbeautify
	rm -f $(BINDIR)/jscorrectify
	-rmdir $(BINDIR)



clean:
	rm -f $(JSBEAUTIFY) $(CSSBEAUTIFY) $(GENERATED)
distclean:
	rm -f $(JSBEAUTIFY) $(CSSBEAUTIFY) $(GENERATED) $(RHINO) rhino1_7R4.zip $(NAME).tar.gz



dist:
	mkdir -p dist/$(NAME)
	cp jsbeautify.in     dist/$(NAME)
	cp jscorrectify.in   dist/$(NAME)
	cp $(JSBEAUTIFY_CL)  dist/$(NAME)
	cp $(CSSBEAUTIFY_CL) dist/$(NAME)
	cp $(ENV_JS)         dist/$(NAME)
	cp Makefile          dist/$(NAME)
	cd dist && tar zcvf ../$(NAME).tar.gz $(NAME)
	rm -r dist



.PHONY: all install uninstall clean distclean dist

