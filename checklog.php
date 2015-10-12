<!DOCTYPE html>
<html>
<body>
<h3>Call Log</h3>
<div style="background-color: #ffffff;color: #000000">
	<pre><?php echo file_get_contents('log/call.log') ?></pre>
</div>
<br>
<h3>token Log</h3>
<div style="background-color: #1b6d85;color: #ffffff">
	<pre><?php echo file_get_contents('log/curlToken.log') ?></pre>
</div>

<br>
<h3>jsapi Log</h3>
<div style="background-color: green;color: #ffffff">
	<pre><?php echo file_get_contents('log/curlJSApi.log') ?></pre>
</div>
</body>
</html>