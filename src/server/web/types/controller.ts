import Router from 'koa-router';

export type Controller = (router: Router) => void;
