attribute float size;
uniform float val;
varying float opacity;
varying vec3 vColor;
void main() {
    // 开始产生模糊的z轴分界
    float border = 40.0;
    // 最模糊的z轴分界
    float min_border = -50.0;
    // 最大透明度
    float max_opacity = 1.0;
    // 最小透明度
    float min_opacity = 0.03;
    // 模糊增加的粒子尺寸范围
    float sizeAdd = 20.0;

    if(position.z > border){
        opacity = max_opacity;
        gl_PointSize = size;
    }else if(position.z < min_border){
        opacity = min_opacity;
        gl_PointSize = size + sizeAdd;
    }else{
        // 模糊程度随距离远近线性增长
        float percent = (border - position.z)/(border - min_border);
        opacity = (1.0-percent) * (max_opacity - min_opacity) + min_opacity;
        gl_PointSize = percent * (sizeAdd) + size;  
    }
        float positionY = position.y;
        
       //  根据y轴坐标计算传递的顶点颜色值
        vColor.x = abs(sin(positionY * val));
        vColor.y = abs(cos(positionY * val));
        vColor.z = abs(cos(positionY * val));
    gl_Position = projectionMatrix * modelViewMatrix  * vec4( position, 1.0 );

}