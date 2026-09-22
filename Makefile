LATEXMK ?= latexmk
PDFLATEX ?= pdflatex
SOURCE := RobFieldingResume.tex
PDF := $(SOURCE:.tex=.pdf)

.PHONY: all clean

all: $(PDF)

$(PDF): $(SOURCE)
	@if command -v $(LATEXMK) >/dev/null 2>&1; then \
		$(LATEXMK) -pdf -interaction=nonstopmode -halt-on-error $(SOURCE); \
	else \
		$(PDFLATEX) -interaction=nonstopmode -halt-on-error $(SOURCE); \
		$(PDFLATEX) -interaction=nonstopmode -halt-on-error $(SOURCE); \
	fi

clean:
	@if command -v $(LATEXMK) >/dev/null 2>&1; then \
		$(LATEXMK) -C $(SOURCE); \
	else \
		$(RM) *.aux *.log *.out *.toc *.fls *.fdb_latexmk *.synctex.gz; \
	fi
