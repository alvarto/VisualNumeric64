<http://alvarto.github.io/VisualNumeric64/#Math.pow(2,-1022)>

## what's this

A intuitively vision of the memory model of how numbers are stored in JavaScript. Should apply to any other similar language which follows [IEEE 754](http://en.wikipedia.org/wiki/IEEE_754) to store numeric things in the form of 64bits floating-point number.

This will explains the accuracy matter in JavaScript in a simple, visual way.

## known issues

This page is totally made for webkit/firefox.

In addition:

- It doesn't support IE fully, nor even so-called modern IE. When calling "Number(xxx).toString(2)" for some value., IE 11 returns value in a hybrid form of exponential AND binary, instead of pure binary value.
- Denormalized number equals zero in chrome for iOS. Dunno y.

## ref

- [IEEE 754](http://en.wikipedia.org/wiki/IEEE_754)
- <a href="http://www.2ality.com/2012/04/number-encoding.html" target="_blank">"How numbers are encoded in JavaScript"</a>
- [My blog article(in Chinese)](http://blog.segmentfault.com/humphry/1190000000407658)

