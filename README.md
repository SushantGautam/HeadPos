# Demo
Check the [live demo](https://sushantgautam.github.io/HeadPos/demo.html "live demo").

# Usage


```html
<script src="https://cdn.jsdelivr.net/gh/SushantGautam/HeadPos/headpos.js"></script>
<div id='headpos'></div>
```


```javascript
<script>
  OnResults = function (rs) {console.log(rs)}

  let headpos = HeadPos.Init(
    OnResults,  //callback on results
    HeadPosDIV = document.getElementById('headpos'), // div to render video canvas
    interval = 0 ); // time in ms to wait between callbacks, 0 is as fast as possible
</script>
```

# Results
![image](https://user-images.githubusercontent.com/16721983/135709814-4f134c07-9ba5-4e02-abe4-47d6894819b5.png)

Callback will get a dictionary with:
```javascript
{
HorizontalDirection: "Right"
HorizontalMagnitude: 0.9363492190335054
VerticalDirection: "Down"
VerticalMagnitude: 1.3243558415961285,
pose: {"..."}
}
```
# Improving
PRs, ideas or suggestions are highly welcome. 👌

# Built With
- [google/mediapipe](https://google.github.io/mediapipe/solutions/face_detection#javascript-solution-api "google/mediapipe")
- [jhabdas/fetch-inject](https://code.habd.as/jhabdas/fetch-inject "jhabdas/fetch-inject")
