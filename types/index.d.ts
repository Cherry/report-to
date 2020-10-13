import { Request, Response, NextFunction } from "express";

type Endpoint = {
	url: string;
	priority?: number;
	weight?: number;
};

type Group = {
	max_age: number;
	endpoints: Endpoint[];
	include_subdomains?: boolean;
	group?: string;
};

type OptionsConfig = {
	groups: Group[];
};

// A quick note, because this requires a more nested object scheme, linters won't be as
// outright with the type defs. To try and help correct this, I am exporting the types
// with the reportTo functions

/**
 * Validates a configuration for using the middleware. Internally, the library will call a separate
 * validate function
 *
 * @param {OptionsConfig} options The configuration object to validate.
 * @returns {function} Will throw error if invalid options argument, returns an express RequestHandler otherwise
 */
declare function reportTo(
	options: OptionsConfig
): (req: Request, res: Response, next: NextFunction) => any;

export { reportTo as default, OptionsConfig, Group, Endpoint };
