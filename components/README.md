If you're reading this, you're probably wondering what is going on here.  This
code is not final, and is in an experimental phase.  The components folder
itself is a mix of heterogenous imperative and declarative shenanigans, so don't
take it as gospel.

That said, Quill is reasonably well-written and has been paired with [Maki's
primary website][maki] in a way that they mutually benefit by sharing code.
Some components are improved by working on Quill, and upstreamed into Maki.
Others are adopted from upstream by way of upgrading the Maki package _a la_
`npm i`.

Maki applications are oriented around **Resources**.  I've capitalized that word
so you know I'm talking about a proper noun — this is important nomenclature for
later.

Right now, there are several subcategories of Component.  Some are whole-page
views, others are modular components.  Some interact with others, some do not.

My goal over the next few months is to come up with a formal grouping of these
architectural categories, as we iron through the remainder of the `TODO:` items.

[maki]: https://maki.io/
