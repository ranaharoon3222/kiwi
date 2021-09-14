"use strict";

const { sanitizeEntity } = require("strapi-utils");
const _ = require("lodash");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Only send back issues from you
   * @param {*} ctx
   */
  async find(ctx) {
    const { user } = ctx.state;
    let entities;

    if (ctx.query._q) {
      entities = await strapi.services.issues.search({
        ...ctx.query,
      });
    } else {
      entities = await strapi.services.issues.find({
        ...ctx.query,
      });
    }

    let domains = await strapi.query("domain").find({
      users: [user.id],
    });

    let newEntites = [];

    entities.map((entity) => {
      domains.map((domain) => {
        domain.issues.map((issue) => {
          if (entity.id === issue.id) {
            return newEntites.push(entity);
          }
        });
      });
    });

    if (user) {
      return newEntites.map((entity) =>
        sanitizeEntity(entity, { model: strapi.models.issues })
      );
    } else {
      return entities.map((entity) =>
        sanitizeEntity(entity, { model: strapi.models.issues })
      );
    }
  },
  /**
   * Retrieve an issues by id, only if it belongs to the user
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state;

    let newEntity;
    let domains = await strapi.query("domain").find({
      users: [user.id],
    });
    const entity = await strapi.services.issues.findOne({ id });

    if (entity) {
      domains.map((domain) => {
        domain.issues.map((issue) => {
          if (entity.id === issue.id) {
            return (newEntity = entity);
          }
        });
      });
    } else {
      ctx.status = 404;
    }
    if (user) {
      return sanitizeEntity(newEntity, { model: strapi.models.issues });
    } else {
      return sanitizeEntity(entity, { model: strapi.models.issues });
    }
  },
};
