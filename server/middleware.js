exports.httpsRedirect = function (req, res, next) {
  if (process.env.NODE_ENV !== 'production' || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  res.redirect('https://' + req.headers.host + req.url);
};

exports.notFound = function(req, res) {
  res.locals.message = 'Sorry! Nothing here...';
  res.locals.error = { status: 404 };
  res.status(404).render('error');
};

exports.error = function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

exports.cors = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, HEAD');
  next();
};
