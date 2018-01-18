"use strict";

// Require dependencies
const gulp = require("gulp");
const babelify = require("babelify");
const browserify = require("browserify");
const vinylSourceStream = require("vinyl-source-stream");
const vinylBuffer = require("vinyl-buffer");

// Load plugins
const plugins = require("gulp-load-plugins")();

// Read configs
const config = require('./config.json');
const dist = config.dist;
const src = config.src;

// Build html
gulp.task("html", () => {
	return gulp.src(src.html)
    .pipe(gulp.dest(dist.dir))
    .pipe(plugins.connect.reload());
});

// Build assets
gulp.task("assets", () => {
	return gulp.src(src.assets)
    .pipe(gulp.dest(dist.assets))
    .pipe(plugins.connect.reload());
});

// Optimize images
gulp.task("images", () => {
	return gulp.src("src/assets/images/**")
		.pipe(plugins.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [
				{ removeUnknownsAndDefaults: false },
				{ cleanupIDs: false }
			]
    }))
		.pipe(gulp.dest("public/assets/images"));
});

// Build styles
gulp.task("styles", () => {
  return gulp.src("src/assets/styles/main.scss")
    .pipe(plugins.sass()
			.on("error", plugins.sass.logError)
		)
    .pipe(gulp.dest("public/assets/styles"));
});

// Build template cache
gulp.task("templates", () => {
  return gulp.src(src.templates.all)
    .pipe(plugins.angularTemplatecache(src.templates.main, {
      root: "/app/",
      templateHeader: "/* To update run `gulp templates`, never manually edit this */\n\n" +
				"/* @ngInject; */\n" +
				"const " + src.templates.module + " = $templateCache => {\n",
			templateFooter: "\n};\n" +
				"export { " + src.templates.module + " };\n"
    }))
    .pipe(gulp.dest(src.app.dir));
});

// Lint JavaScript
gulp.task("jshint", () => {
	return gulp.src(src.app.all)
		.pipe(plugins.jshint({
			esnext: true
		}))
		.pipe(plugins.jshint.reporter("jshint-stylish"));
});

// Build JavaScript
gulp.task("scripts", ["jshint"], () => {
  const sources = browserify({
      entries: src.app.dir + src.app.main,
			debug: true // enable source maps
    })
    .transform(babelify.configure({
      presets: ["env"]
    }));

  return sources.bundle()
		.pipe(vinylSourceStream(dist.app.main))
		.pipe(vinylBuffer())
		.pipe(plugins.sourcemaps.init({
			loadMaps: true // load maps browserify already generated
		}))
		.pipe(plugins.ngAnnotate())
		.pipe(plugins.uglify({
      mangle: false
    }))
		.pipe(plugins.sourcemaps.write("./", {
			includeContent: true
		}))
		.pipe(gulp.dest(dist.app.dir))
		.pipe(plugins.connect.reload());
});

// Clean the build
gulp.task("clean", () => {
  return gulp.src([
		  "**/.DS_Store",
			dist.dir
		])
    .pipe(plugins.clean());
});

// Clean and build
gulp.task("build", ["clean"], () => {
  gulp.start("html");
  gulp.start("assets");
  gulp.start("templates");
  gulp.start("scripts");
	gulp.start("styles");
});

// Watch for changes
gulp.task("watch", () => {
	gulp.watch(src.assets, ["assets"]);
  gulp.watch(src.templates.all, ["templates"]);
	gulp.watch(src.html, ["html"]);
	gulp.watch(src.app.all, ["scripts"]);
	gulp.watch("src/**/*.{scss,sass}", ["styles"]);
});

// Serve build, make default task
gulp.task("serve", ["build", "watch"], () => {
	plugins.connect.server({
		root: dist.dir,
		port: 8080,
		livereload: true,
		fallback: dist.dir + "index.html"
	});
});
gulp.task("default", ["serve"]);
