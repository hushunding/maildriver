import * as http from 'http';
import * as url from 'url';

interface IQueryCmd {
    _nodeIndex: number;
    sort: string; order: string;
    isForce: boolean;
}
const server = http.createServer((req, res) => {
    const { pathname, query: IQueryCmd } = url.parse(req.url, true);
    switch (pathname) {
        case "/fileList":
            break;
        default:
            res.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    }
});
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
server.listen(10800);
