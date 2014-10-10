/*!
 * jQuery JapaneseMonospace Plugin v1.0.0
 * https://github.com/criticalbreak5/japanese_monospace
 *
 * Copyright 2014 criticalbreak5's
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 * Date: 2014-10-11T00:00Z
 */
(
	function($) {
		$.fn.japanese_monospace = function(options) { // $.fn === $.prototype

			var timerId = null;
			var saveValue = null;

			var defaults = {
				"preview-control-id"           :"preview_control_id", 
				"preview-control-relative-top" :"0px", 
				"preview-control-relative-left":"0px", 
				"preview-control-line-length"  :"100", // HalfWidthChar : 1, FullWidthChar : 2
				"focus-background-color"       :"#FFFFFF", 
				"blur-background-color"        :"#FFFFFF", 
				"delay"                        :"1000"
			};
			options = $.extend(defaults, options);

			return this.each(function() {
				core(this);
			});
			function core(target) {
				var target_preview = $(target).clone(false);
				target_preview.attr("id", options["preview-control-id"]);
				$(target_preview).empty();
				$(target_preview).hide();
				$(target_preview).css({ "position":"relative" });
				if (options["preview-control-override-width"]) {
					target_preview.css({ "width" :options["preview-control-override-width"]  });
				}
				if (options["preview-control-override-height"]) {
					target_preview.css({ "height":options["preview-control-override-height"] });
				}
				$(target_preview).css({ "top" :options["preview-control-relative-top"]  });
				$(target_preview).css({ "left":options["preview-control-relative-left"] });
				$(target).after(target_preview);
				$(target).focus( function() { _focus(target, target_preview); } );
				$(target).blur(  function() { _blur( target, target_preview); } );
			};
			function _focus(target, target_preview) {
				$(target).css({ "background-color":options["focus-background-color"] });
				$(target_preview).fadeIn();
				timerId = 
					setInterval(
						function() {
							if (saveValue != $(target).val()) {
								$(target_preview).val(autoNewLine(Number(options["preview-control-line-length"]), $(target).val()));
							}
							saveValue = $(target).val();
						},
						Number(options["delay"]));
			};
			function _blur(target,  target_preview) {
				$(target).css({ "background-color":options["blur-background-color"] });
				clearInterval(timerId);
				timerId = null;
				saveValue = null;
				$(target_preview).fadeOut();
			};
			function autoNewLine(lineLength, org) {
				var newText = [];
				var tmpLineLength = 0;
				for (var i = 0; i < org.length; i++) {
					var _char = org.charAt(i);
					if (_char == '\r') {
						continue;
					}
					if (_char == '\n') {
						newText.push('\n');
						tmpLineLength = 0;
					} else {
						tmpLength = isHalfWidthChar(_char) ? 1 : 2;
						if (lineLength < tmpLineLength + tmpLength) {
							newText.push('\n');
							tmpLineLength = 0;
						}
						newText.push(_char);
						tmpLineLength += tmpLength;
					}
				}
				return newText.join("");
			}
			function isHalfWidthChar(_char) {
				var code = _char.charCodeAt();
				return ((code >= 0x0 && code < 0x81) || (code == 0xf8f0) || (code >= 0xff61 && code < 0xffa0) || (code >= 0xf8f1 && code < 0xf8f4));
			}
		};
})(jQuery);
