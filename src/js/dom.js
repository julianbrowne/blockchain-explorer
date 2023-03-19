
import {utils} from "./utils";

function cardContainer(title, content) { 

	const card = $("<div>")
		.addClass("card");

	const header = $("<div>")
		.addClass("card-header")
		.html(title);

	const body = $("<div>")
		.addClass("card-body");

	body.append(content);

	card
		.append(header)
		.append(body);

	return card;

};

/**
 * Updates a cell (text input) with an optional new value
 * and checks if the value is different to the original
**/

function updateCellValue(cell, value) { 

	if(value) { 
		cell.val(value);
		cell.prop("title", value);
	};

	const cellValueNow = cell.val();

	if(cell.data() && cell.data().originalValue) { 

		const cellOriginalValue = cell.data().originalValue;

		if(cellValueNow !== cellOriginalValue) { 
			cell.addClass("border");
			cell.addClass("border-danger");
			cell.addClass("text-danger");				
		}
		else { 
			cell.removeClass("border");
			cell.removeClass("border-danger");
			cell.removeClass("text-danger");				
		};

	};

};

/**
 * Builds a bootstrap input group like this:
 * 
 * <div class="input-group">
 * 	<div class="input-group-prepend w-25">
 * 		<span class="input-group-text">{{title}}</span>
 * 	</div>
 * 	<input class="form-control" type="text" {{inputData}}>
 * </div>
 * 
**/

function inputCluster(title, inputData, labelClass) { 
	const group = inputGroup();
	const label = inputGroupLabel(title, labelClass);
	const input = inputElement(inputData);

	group.onKeyupChain = function(f) { 
		input.on("keyup", f);
	};

	group.append(label).append(input);
	return group;
};

/**
 * Builds a text / hash combo
**/

function textHashCombo(title, data) { 

	if(data.val===undefined) { 
		data.val = "";
	};

	if(data.id===undefined) { 
		data.id = "combo-input";
	};

	if(data.data===undefined) { 
		data.data = {};
	};

	const hashElementId = "hash-" + data.id;
	data.data.hashElementId = hashElementId;
	data.data.originalValue = data.val;

	data.keyup = function(event) { 
		const newValue = $(event.currentTarget).val();
		const newHash = utils.hash(newValue);
		const targetElement = $("#" + hashElementId);
		updateCellValue(targetElement, newHash);
	};

	const container = $("<span>");

	/**
	 * input group1 - plain text
	**/

	const inputGroup1 = inputGroup();
	const label1 = inputGroupLabel(title, "plain-text-message-label");
	const input1 = inputElement(data);
	inputGroup1.append(label1).append(input1);

	container.append(inputGroup1);

	container.onKeyupChain = function(f) { 
		input1.on("keyup", f);
	};

	container.getHashValue = function() { 
		return input1.val();
	};

	/**
	 * input group2 - hash output
	**/

	const arrow = glyph("bi-arrow-return-right").prop('outerHTML');
	const h = utils.hash(data.val);

	const inputGroup2 = inputGroup("mb-3");
	const label2 = inputGroupLabel(arrow + "&nbsp;hash", "hash-of-message-label");
	const input2 = inputElement({ 
		id: "hash-" + data.id,
		val: h,
		data: { 
			originalValue: h
		},
		disabled: true
	});
	inputGroup2.append(label2).append(input2);

	container.append(inputGroup2);

	return container;

};

/**
 * build a button
**/

function button(text, cssClass) { 

	const button = $("<button>")
		.html(text)
		.addClass("btn");

	if(cssClass!==undefined) { 
		button.addClass(cssClass);
	}
	else { 
		button.addClass("btn-outline-dark");
	}

	return button;

};

/**
 * find the location of where the script is being called
 * so all content can be inserted at that spot
**/

function findLocation() { 
	return $("script")[$("script").length-1];
};

/**
 * <i class="bi bi-arrow-return-right"></i>
**/

function glyph(glyph) { 
	return $("<i>")
		.addClass("bi")
		.addClass(glyph);
};

/**
 * form field label as part of input group
 * with optional css class
**/

function inputGroupLabel(text, cssClass) { 

	const label = $("<span>")
		.addClass("input-group-text")
		.html(text);

	if(cssClass!==undefined) { 
		label.addClass(cssClass);
	};

	return label;

};

/**
 * Bootstrap input group with optional
 * extra css class, e.g. for margin control
**/

function inputGroup(cssClass) { 

	const ig = $("<div>").addClass("input-group");

	if(cssClass!==undefined) { 
		ig.addClass(cssClass);
	};

	return ig;

}

function inputElement(data, cssClass) { 
	
	if(data.type===undefined) { 
		data.type = "text";
	};

	const input = $("<input>")
		.addClass("form-control")
		.attr("type", data.type);

	if(cssClass!==undefined) { 
		input.addClass(cssClass);
	};

	if(data.id!==undefined) { 
		input.attr("id", data.id);
	};

	if(data.val!==undefined) { 
		input.val(data.val);
		input.prop("title", data.val);
	};

	if(data.disabled) { 
		input.prop("readonly", true).prop("disabled", true);
	};

	if(data.pattern!==undefined) { 
		input.prop("pattern", data.pattern);
	};

	if(data.class!==undefined) { 
		input.addClass(data.class);
	};

	if(data.placeholder!==undefined) { 
		input.prop("placeholder", data.placeholder);			
	};

    if(data.keyup!==undefined) { 
    	input.keyup(data.keyup);
    };

    if(data.maxlength!==undefined) { 
		input.prop("maxlength", data.maxlength);				    	
    };

    if(data.data!==undefined) { 
    	const keys = Object.keys(data.data);
    	for(let i=0; i<keys.length; i++) { 
			input.data(keys[i], data.data[keys[i]]);	    		
    	};
    };

	return input;

};

function formGroup(id) { 
	const fg = $("<div>").addClass("form-group");
	if(id) { 
		fg.attr("id", id);
	}
	return fg;
};

export { 
	findLocation, 
	cardContainer,
	inputElement, 
	inputGroup,
	formGroup,
	glyph,
	inputCluster,
	updateCellValue,
	textHashCombo,
	button
};
