var paginationButton= require('./paginationButton');

module.exports= function (argObj) {
	// triggerButton,restPath,verb,dataFunc,headers,success,error,eventSubscribe,limit

	var required=['triggerButton','restPath','verb','dataFunc']

	if(!argObj.hasOwnProperty('triggerButton') || !argObj.hasOwnProperty('restPath') || !argObj.hasOwnProperty('dataFunc') || !argObj.hasOwnProperty('verb'))
	{
		throw {msg:'Required properties to frontle-event-ajax '+required.join(',')+' not present'};
	}

	return function (ctx,next) {
		
		var pgButton;

		if(argObj.hasOwnProperty('limit') && argObj.limit>0)
			pgButton= new paginationButton({limit:argObj.limit});
		else
			pgButton= new paginationButton();

		pgButton
		.elem(argObj.triggerButton);

		if(argObj.hasOwnProperty('eventSubscribe'))
		{
			pgButton.event(argObj.eventSubscribe);
		}

		pgButton
		.promise(function () {
			
			var data= argObj.dataFunc(ctx);

			return Promise.all([$.ajax({
				url: argObj.restPath,
				method: argObj.verb.toUpperCase(),
				data: data,
				headers:argObj.headers
			}).promise()])
			.then(function (result) {
				return result[0];
			});
		})
		.effect(argObj.success || ctx.successFunc ||function (result) {
			console.log(result);
		})
		.error(argObj.error || ctx.errorFunc ||function (err) {
			console.log(err);
		})
		.done();

		next();
	}
}