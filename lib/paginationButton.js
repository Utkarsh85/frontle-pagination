var pagination = function(obj)
{
	this._elem= '.pagination';
	this._limit= 10;
	if(obj)
		this._limit= obj.limit||10;
	this._error= function(err){
		console.log(err);
	};
};

pagination.prototype.elem= function(name)
{
	this._elem= name;
	return this;
};

pagination.prototype.event= function(eventName)
{
	this._event= eventName;
	return this;
};

pagination.prototype.promise= function(promiseFunc)
{
	this._promise= promiseFunc;
	return this;
};


pagination.prototype.effect= function(effectFunc)
{
	this._effect= effectFunc;
	return this;
};

pagination.prototype.error= function(errorFunc)
{
	this._error= errorFunc;
	return this;
};

pagination.prototype.done= function()
{
	var self= this;
	// Initialize
	$(self._elem).attr('limit',self._limit);
	$(self._elem).attr('skip',self._limit);
	$(self._elem).attr('state','dormant');

	// Intialize click/event procedure
	var event="click";
	if(self._event)
		event=self._event;

	$(self._elem)[event](function(generatedEvent){
		if($(self._elem).attr('state') == "dormant")
		{
			$(self._elem).attr('state','working');
			self._promise( $(self._elem).attr('skip') , $(self._elem).attr('limit') , generatedEvent )
			.then(self._effect)
			.then(function(){
				$(self._elem).attr('state','dormant');
				var newSkipVal=parseInt($(self._elem).attr('skip'))+self._limit;
				$(self._elem).attr('skip',newSkipVal);
			})
			.catch(function (err) {
				$(self._elem).attr('state','dormant');
				self._error(err);
			});
		}
	});
};


module.exports= pagination;

