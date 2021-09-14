"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Only send back company from you
   * @param {*} ctx
   */
  async find(ctx) {
    const { user } = ctx.state;
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.company.search({
        ...ctx.query,
        user: user.id,
      });
    } else {
      entities = await strapi.services.company.find({
        ...ctx.query,
        user: user.id,
      });
    }
    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.company })
    );
  },
  /**
   * Retrieve an company by id, only if it belongs to the user
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    const entity = await strapi.services.company.findOne({ id, user: user.id });
    return sanitizeEntity(entity, { model: strapi.models.company });
  },
};
