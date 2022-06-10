const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();

app.use(cors());
//app.use(koaBody({json: true}));

app.use(koaBody({
   multipart: true,
   json: true,
   urlencoded: true
}));
// {id: '0', content: `hello`, created: Date.now()}
//let posts = [{id: '0', content: `hello`, created: Date.now()}];
//let nextId = 1;

let nextId = 1;
let posts = [
    {id:nextId++ ,content: 'React - современная библиотека ', created : '2022-11-12'},
    {id:nextId++, content: 'Исполизование возможностей библиотеки React', created : '2022-02-12'},
    {id:nextId++, content: 'Bootstrap -современный css', created : '2016-12-12'},
    {id:nextId++ ,content: 'React  4', created : '2022-11-12'},
    {id:nextId++, content: 'Исполизование 5', created : '2022-02-12'},
    {id:nextId++, content: 'Boot-6', created : '2018-12-10'},
];

const router = new Router();

router.get('/posts', async (ctx, next) => {
    ctx.response.body = JSON.stringify(posts);
    console.log("ctx-----get", ctx.response.body);
});

router.post('/posts', async(ctx, next) => {
    const {id, content, created} = ctx.request.body;
    const data = JSON.parse(ctx.request.body);
    console.log("ctx----------", ctx.response.body,'data\n', data);
    if (id !== 0) {
        posts = posts.map(o => o.id !== id ? o : {...o, content: content});
        ctx.response.status = 204;
        return;
    }

    posts.push({...ctx.request.body, id: nextId++, created: Date.now()});
    ctx.response.status = 204;
});

router.delete('/posts/:id', async(ctx, next) => {
    console.log("id backend----------", ctx, nextId);
    const postId = JSON.parse(ctx.params.id);
    const index = posts.findIndex(o => o.id === postId);
    if (index !== -1) {
        posts.splice(index, 1);
        console.log("posts delete backend res!!!!", posts);
    }
    ctx.response.status = 204;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started----'));