#
# jscorrectify - jslint[1] and jsbeautifier[2] command-line interfaces.
#
# [1]: http://jslint.com
# [2]: http://jsbeautifier.org
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


JSHINT=jshint.js
JSLINT=fulljslint.js
JSBEAUTIFY=beautify.js beautify-cl.js beautify-html.js
RHINO=js.jar
GENERATED=jshint jslint jsbeautify jscorrectify



all: $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(RHINO)


$(JSHINT): $(GENERATED)
	@$(SHELL) ./jscorrectify --init jshint

$(JSLINT): $(GENERATED)
	@$(SHELL) ./jscorrectify --init jslint

$(JSBEAUTIFY): $(GENERATED)
	@$(SHELL) ./jscorrectify --init jsbeautify


$(RHINO):
	curl -O ftp://ftp.mozilla.org/pub/mozilla.org/js/rhino1_7R2.zip
	unzip -jo rhino1_7R2.zip rhino1_7R2/js.jar

$(GENERATED):
	sed '1,$$s;@datarootdir@;$(DATAROOTDIR);g' $@.in > $@



install: all jshint-cl.js jslint-cl.js
	mkdir -p $(DATAROOTDIR)
	cp -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(RHINO) jshint-cl.js jslint-cl.js $(DATAROOTDIR)
	mkdir -p $(BINDIR)
	cp -f $(GENERATED) $(BINDIR)
	cd $(BINDIR) && chmod +x $(GENERATED)



uninstall:
	cd $(DATAROOTDIR) && rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(RHINO) jshint-cl.js jslint-cl.js
	-rmdir $(DATAROOTDIR)
	rm -f $(BINDIR)/jslint
	rm -f $(BINDIR)/jsbeautify
	rm -f $(BINDIR)/jscorrectify
	-rmdir $(BINDIR)



clean:
	rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(GENERATED)
distclean:
	rm -f $(JSHINT) $(JSLINT) $(JSBEAUTIFY) $(GENERATED) $(RHINO) rhino1_7R2.zip $(NAME).tar.gz



dist:
	mkdir -p dist/$(NAME)
	cp jsbeautify.in   dist/$(NAME)
	cp jscorrectify.in dist/$(NAME)
	cp jshint.in       dist/$(NAME)
	cp jslint.in       dist/$(NAME)
	cp jshint-cl.js    dist/$(NAME)
	cp jslint-cl.js    dist/$(NAME)
	cp Makefile        dist/$(NAME)
	cd dist && tar zcvf ../$(NAME).tar.gz $(NAME)
	rm -r dist



.PHONY: all install uninstall clean distclean dist

