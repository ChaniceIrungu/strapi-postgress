'use strict';

/**
 * scramble service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::scramble.scramble');
