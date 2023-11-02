/**
 * Vector.js v1.0.0
 * @param {number} x 
 * @param {number} y 
 */
class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    // Static Functions
    static dst(v1, v2) {
        return v1.dst(v2);
    }

    static dstSq(v1, v2) {
        return v1.dstSq(v2);
    }

    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }

    static fromAngle(angle) {
        let v = new Vector(0, 0);
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        return v;
    }

    static random2D(v) {
        return Vector.fromAngle(Math.random() * Math.PI * 180);
    }

    add(x, y) {
        if (arguments.length === 1) {
            this.x += x.x;
            this.y += x.y;
        } else if (arguments.length === 2) {
            this.x += x;
            this.y += y;
        }
        return this;
    }

    sub(x, y) {
        if (arguments.length === 1) {
            this.x -= x.x;
            this.y -= x.y;
        } else if (arguments.length === 2) {
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    mult(v) {
        if (typeof v === 'number') {
            this.x *= v;
            this.y *= v;
        } else {
            this.x *= v.x;
            this.y *= v.y;
        }
        return this;
    }

    div(v) {
        if (typeof v === 'number') {
            this.x /= v;
            this.y /= v;
        } else {
            this.x /= v.x;
            this.y /= v.y;
        }
        return this;
    }

    setAngle(angle) {
        var len = this.mag();
        this.x = Math.cos(angle) * len;
        this.y = Math.sin(angle) * len;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    magSq() {
        return (this.x * this.x + this.y * this.y);
    }

    setXY(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setMag(value) {
        this.normalize();
        this.mult(value);
        return this;
    }

    normalize() {
        let m = this.mag();
        if (m > 0) {
            this.div(m);
        }
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    heading() {
        return (-Math.atan2(-this.y, this.x));
    }

    dst(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    dstSq(v) {
        let dx = this.x - v.x;
        let dy = this.y - v.y;
        return (dx * dx + dy * dy);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    negative() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    array() {
        return [this.x, this.y];
    }

    toString() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
    }

    project(v) {
        var coeff = ((this.x * v.x) + (this.y * v.y)) / ((v.x * v.x) + (v.y * v.y));
        this.x = coeff * v.x;
        this.y = coeff * v.y;
        return this;
    }

    rotate(a) {
        var b = this.heading() + a;
        var c = this.mag();
        this.x = Math.cos(b) * c;
        this.y = Math.sin(b) * c;
    }
}