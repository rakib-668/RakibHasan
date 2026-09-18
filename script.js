document.getElementById('year').textContent = new Date().getFullYear();

  // Animated network background — nodes drifting, links connecting nearby nodes
  (function(){
    var canvas = document.getElementById('bg-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W, H, nodes = [];
    var LINK_DIST = 150;
    var TEAL = '53,208,176';
    var STEEL = '110,146,201';
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize(){
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      var count = Math.round((W * H) / 16000);
      count = Math.max(30, Math.min(85, count));
      nodes = [];
      for (var i = 0; i < count; i++){
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 1.2 + Math.random() * 1.6
        });
      }
    }

    function frame(){
      ctx.clearRect(0, 0, W, H);

      for (var i = 0; i < nodes.length; i++){
        var n = nodes[i];
        if (!reduceMotion){
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
        }
      }

      for (var i = 0; i < nodes.length; i++){
        for (var j = i + 1; j < nodes.length; j++){
          var a = nodes[i], b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y;
          var dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < LINK_DIST){
            var alpha = (1 - dist / LINK_DIST) * 0.45;
            ctx.strokeStyle = 'rgba(' + TEAL + ',' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (var i = 0; i < nodes.length; i++){
        var n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + (i % 3 === 0 ? STEEL : TEAL) + ',0.85)';
        ctx.fill();
      }

      if (!reduceMotion) requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize);
    frame();
  })();
