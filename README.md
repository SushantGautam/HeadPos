This simplified library gives position (up/down/lest/right) of head/face including its magnitude/degree with the six faical keypoints (x,y). This is backed by MediaPipe. The whole library and its dependencies are just in KBs. The memory footprint is very low on realtime environment and can run on very low resources. There are options to control time between inference which reduces unnecessary computations. 

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
**pose** contains a dict with 6 key points (x,y) of right eye, left eye, nose tip, mouth center, right ear tragion, and left ear tragion and a reference to the canvas.

# Improving
PRs, ideas or suggestions are highly welcome. 👌

# Built With
- [google/mediapipe](https://google.github.io/mediapipe/solutions/face_detection#javascript-solution-api "google/mediapipe")
- [jhabdas/fetch-inject](https://code.habd.as/jhabdas/fetch-inject "jhabdas/fetch-inject")


# Methods
1. **InitHeadPos** 
Initialize the instance. This library has a singleton implementation.

```javascript
let headpos = HeadPos.Init(
    HeadPosOnResults,  //callback on log value
    HeadPosDIV = document.getElementById('headpos'), // div to render headpos
    interval = 100, // time in ms to wait between callbacks, 0 is as fast as possible
	minDetectionConfidence =0.5, //Face Recognition threshold 
	 model = "short",  //  short-range model that works best for faces within 2 meters from the camera 
	 selfieMode = false,  //invert the camera 
	); 

```
2. **updateInterval**
Dynamically udate time in ms to wait between callbacks.

```javascript
headpos.updateInterval(1000) 
```

3. **pause**
Pause the inference. Canvas rendering will also pause.

```javascript
headpos.pause() 
```

4. **resume**
Resume the inference after pause. Canvas rendering will also resume.

```javascript
headpos.resume() 
```
