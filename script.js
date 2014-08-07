$(window).load(function(){
	"use strict" ;
	String.prototype.regRep = function(obj) {
	  return this.replace(/\$\w+\$/gi, function(matchs) {
		var returns = obj[matchs.replace(/\$/g, "")];
		return (returns + "") == "undefined"? "": returns;
	  });
	};

	var TYPE = {
		regs : {
			Normalized : /^-?[01]*\.?[01]*$/ ,
			MaybeDenormalized : /^-?0\.[01]*1$/ ,
			NotANumber : /^NaN$/ ,
			Infinities :/^-?Infinity$/ ,
			Zero : /^0$/ ,
		} ,
		getType : function (str) {
			for ( var i in this.regs ) {
				if ( this.regs[i].test(str) ) {
					return i ;
				}
			}
			return "Unexpected Value" ;
		}
	} ;

	function getEnoughAfter( str , length , wit ) {
		var i = str.length ;
		while ( i < length ) {
			str += wit ? wit : '0' ;
			i++ ;
		}
		return str ;
	}

	function getEnoughBefore( str , length , wit ) {
		var i = str.length ;
		while ( i < length ) {
			str = wit ? wit + str : '0' + str ;
			i++ ;
		}
		return str ;
	}

	function getModel (input) {
		var input = input || "" ,
			result = typeof input !== "string" ? Number( eval(input.toString()) ) : Number( eval(input) ) ,
			binary = result.toString(2) ,
			type = TYPE.getType(binary) ,
			exponent , ZFlag , mathHide , significant ,
			mExp, mPrefix , absBinary ;

		// get ZFlag
		if ( result < 0 ) {
			ZFlag = 1;
		} else if ( result > 0 ) {
			ZFlag = 0;
		} else {
			ZFlag = "?" ;
		}

		absBinary = binary.replace(/\-/,"") ;

		switch( type ) {
		case "NotANumber" :
			binary = "not available" ;
			mathHide = "hidden" ;
			exponent = 2047 ;
			significant = getEnoughAfter( "" , 52 , "?" ) ;
			break ;
		case "Infinities" :
			binary = "not available" ;
			mathHide = "hidden" ;
			exponent = 2047 ;
			significant = "0" ;
			break ;
		case "Zero" :
			mathHide = "hidden" ;
			exponent = 0 ;
			significant = "0" ;
			break ;
		case "Normalized" :
			mPrefix = "1." ;
			exponent = absBinary.lastIndexOf(".") > 0    ?
				1022 + absBinary.lastIndexOf(".") :
				1022 + absBinary.length ;
			significant = absBinary.replace(/\./ , "").substr(1,52) ;
			break;
		case "MaybeDenormalized" :
			exponent = 0 ;
			// try normalizing
			// sub "0."
			var decimal = absBinary.substr(2) ,
				delta = decimal.indexOf(1) ;
			if ( delta > 1021 ) {
				exponent = 0 ;
				mPrefix = "0." ;
				type = "Denormalized" ;
				significant = decimal.substr(1022) ;
			} else {
				exponent = 1022 - delta ;
				mPrefix = "1." ;
				type = "Normalized" ;
				significant = decimal.substr(delta+1,delta+52) ;
			}
			break;
		default :
			significant = 0 ;
			exponent = 0 ;
			break;
		}

		significant = getEnoughAfter( significant , 52 , "0" ) ;
		mExp = getEnoughBefore( exponent.toString(2) , 11 , "0" ) ;

		if ( type === "Denormalized" ) {
			// small exponent fix for Denormalized Number
			exponent = 1 ;
		}

		return {
			result : result ,
			type : type ,
			binary : binary ,
			X : significant ,
			Y : exponent ,
			Z : ZFlag ,
			mathHide : mathHide ,
			mX : significant ,
			mP : mPrefix ,
			mY : mExp ,
			mZ : ZFlag
		}
	}

	var $text = $("#text") ,
		$result = $("#result") ,
		template = $("#template").text() ,
		$window = $(window) ;

	$text.on("input",function(){
		window.location.hash = this.value ;
	}) ;

    var onHashChangeFunc = function(){
		var hashvalue = window.location.hash ? window.location.hash.substr(1) : "" ;
		if ( $text.val() != hashvalue ) {
			$text.val(hashvalue) ;
		}

		try {
			$result.html(template.regRep( getModel(hashvalue) )) ;
		} catch(e){
			$result.html(e) ;
		}

		document.body.scrollIntoView() ;
        $text.focus() ;
	} ;
	$window.on("hashchange",onHashChangeFunc) ;
	$(onHashChangeFunc) ;
});