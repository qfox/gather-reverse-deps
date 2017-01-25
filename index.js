const COA = require('coa');
const chalk = require('chalk');
const depsLoad = require('@bem/deps/lib/load');
const Graph = require('./bem-graph');
const bemNaming = require('bem-naming');
const pkg = require('./package.json');

const CLI = module === process.mainModule;

const buildGraph = deps => {
    const graph = new Graph();

    [].concat(deps).forEach(dep => {
        dep.vertex.entity = dep.vertex.entity.valueOf();
        dep.dependOn.entity = dep.dependOn.entity.valueOf();

        const vertex = graph.vertex(dep.vertex.entity, dep.vertex.tech);

        dep.ordered ?
            vertex.dependsOn(dep.dependOn.entity, dep.dependOn.tech) :
            vertex.linkWith(dep.dependOn.entity, dep.dependOn.tech);
    });

    return graph;
};

const _id = cell => [
    cell.entity.block,
    cell.entity.elem && `__${cell.entity.elem}`,
    Object(cell.entity.mod).name && `_${cell.entity.mod.name}`,
    Object(cell.entity.mod).val && (cell.entity.mod.val !== true) && `_${cell.entity.mod.val}`,
    cell.tech && `.${cell.tech}`
].filter(Boolean).join('');

const P = module.exports = COA.Cmd()
    .name(process.argv[1] || pkg.name)
    .title(pkg.description)
    .helpful()
    .opt().name('version').title('Version').short('v').long('version').flag()
        .act(() => { console.log(`v${pkg.version}`); process.exit(0); }).end()
    .opt().name('tech').title('Technology').short('t').long('tech').flag().end()
    .arg().name('entities').title('Entities to find. Regexp').req().def(null).end()
    .arg().name('levels').title('Levels paths with deps.js to build graph').req().def(null).arr().end()
    .act((opts, args) => {
        if (!args.entities || !args.levels[0]) {
            if (args.entities) {
                console.log(chalk.red(`Missing levels argument\n`));
            }
            return CLI ? P.do(['--help']) : [];
        }

        const entities = [ bemNaming.parse(args.entities) ];

        return depsLoad({ levels: args.levels })
            .then(buildGraph)
            .then(graph => graph.reverseDependenciesOf(entities, opts.tech))
            .then(cells => CLI ? cells.map(_id).join('\n') : cells)
            .catch(e => {
                CLI && console.error(e.stack);
                CLI && process.exit(2);
                throw e;
            });
    });

CLI && P.run(process.argv.slice(2));
