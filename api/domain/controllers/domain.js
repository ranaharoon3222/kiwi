"use strict";

const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Only send back domain from you
   * @param {*} ctx
   */
  async find(ctx) {
    const { user } = ctx.state;

    let entities;
    if (user) {
      if (ctx.query._q) {
        entities = await strapi.services.domain.search({
          ...ctx.query,
          users: [user.id],
        });
      } else {
        entities = await strapi.services.domain.find({
          ...ctx.query,
          users: [user.id],
        });
      }
    } else {
      if (ctx.query._q) {
        entities = await strapi.services.domain.search({
          ...ctx.query,
        });
      } else {
        entities = await strapi.services.domain.find({
          ...ctx.query,
        });
      }
    }

    return entities.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models.domain })
    );
  },
  /**
   * Retrieve an domain by id, only if it belongs to the user
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;
    let entity;
    if (user) {
      entity = await strapi.services.domain.findOne({ id, user: user.id });
    } else {
      entity = await strapi.services.domain.findOne({ id });
    }
    return sanitizeEntity(entity, { model: strapi.models.domain });
  },
};
