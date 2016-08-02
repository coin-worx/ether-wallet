let appInjectorRef;

export const appInjector = (injector = null) =>{
	if(!injector){
		return appInjectorRef;
	}

	appInjectorRef = injector;

	return appInjectorRef;
};