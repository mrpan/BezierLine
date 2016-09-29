var LineString = function(coords) {
    this.coords = coords||[];
    this.length = this.coords.length;
};

LineString.prototype.move_to = function(coord) {
    this.length++;
    this.coords.push(coord);
};

var Bezier = function(start,end){
	this.PointA = start;
	this.PointB = end;
	
}
Bezier.prototype.getLine =function(num_points,options){
	var theta = options.theta;
	var azimuth = this.getAzimuth(this.PointA,this.PointB);
    var base_length = this.getPointLength(this.PointA,this.PointB)
    if(base_length>0.05){//弧度限制
         base_length=0.03
     }
    var theta_adj
    //  console.log("theta="+theta);
    //   console.log(" Math.sin(azimuth)="+ Math.sin(azimuth));
    if(azimuth >= 180){
       theta_adj= -1 * theta * Math.sin(azimuth*Math.PI/180);
    }else{
       theta_adj= theta * Math.sin(azimuth*Math.PI/180);
    }
     console.log("theta_adj="+theta_adj);
    if(theta_adj<1){
        theta_adj=30;
    }
    var hyp_len =base_length/(Math.cos(theta_adj*Math.PI/180));

    var p2 = this.PointA;
    //azimuth-theta_adj+10 避免角度重合
    p2 ={x:Math.sin((azimuth-theta_adj+10)*Math.PI/180)*hyp_len+this.PointA.x,
    		y:Math.cos((azimuth-theta_adj+10)*Math.PI/180)*hyp_len+this.PointA.y};
   


    var points = [];
     points.push([this.PointA.x,this.PointA.y]);
    for(var i=0;i<num_points;i++){
        var p_value = 1/num_points*i;
        var x0 = ((1 - p_value)*(((1 - p_value)*this.PointA.x) + (p_value * p2.x))) + (p_value * (((1 - p_value)*p2.x) + (p_value * this.PointB.x)))
        var y0 = ((1 - p_value)*(((1 - p_value)*this.PointA.y) + (p_value * p2.y))) + (p_value * (((1 - p_value)*p2.y) + (p_value * this.PointB.y)))

        var point = [x0,y0];
        points.push(point);
    }
    points.push([this.PointB.x,this.PointB.y]);
    var line = new LineString(points);
    return line;
}
/**
 * 两点连线与正北的方向角
 */
Bezier.prototype.getAzimuth=function(pointA,pointB){
	var ty = pointB.y - pointA.y;
    var tx = pointB.x - pointA.x;
     var  theta = Math.atan2(ty, tx);
     var angle = theta * (180 / Math.PI);
     // console.log("ttt"+theta+',angle='+angle);
    if(ty>0&&tx<=0){  
         angle=(90-angle)+360;  
    }else if(ty<=0&&tx<0){  
         angle=angle+360.;  
    }else if(ty<0&&tx>=0){  
         angle= (90-angle);  
    }  
    angle =Math.round(angle)

    return angle;
}
/**
 * 两点平面长度
 */
Bezier.prototype.getPointLength=function(pointA,pointB){
	var length
    var tx = pointB.x-pointA.x;
    var ty = pointB.y-pointA.y;
    if(Math.abs(tx)<=180){
        length = Math.sqrt(Math.pow(tx,2)+Math.pow(ty,2))*0.5
    }else{
        length= Math.sqrt(Math.pow(360-(tx),2)+Math.pow(ty,2))*0.5
    }
    return length
}

if (typeof window === 'undefined') {
	  // nodejs
	  module.exports.Bezier = Bezier;

 } else {
	  // browser
	  var arcline = {};
	  arcline.Bezier = Bezier;
}