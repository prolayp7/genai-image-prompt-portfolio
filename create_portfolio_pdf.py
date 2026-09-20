from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import textwrap

ROOT = Path(__file__).parent
ASSETS = ROOT / "dist" / "assets"
OUT = ROOT / "output" / "pdf" / "Prolay_Panda_GenAI_Visual_Systems_Portfolio.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = landscape(A4)
INK = HexColor("#111111")
PAPER = HexColor("#F3F0E9")
PINK = HexColor("#FF4F9A")
LIME = HexColor("#D7FF3F")
BLUE = HexColor("#2637FF")
GRAY = HexColor("#DCD7CE")
WHITE = HexColor("#FFFFFF")

pdfmetrics.registerFont(TTFont("Body", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Mono", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"))

def bg(c, color=PAPER):
    c.setFillColor(color); c.rect(0, 0, W, H, fill=1, stroke=0)

def image_cover(c, path, x, y, w, h):
    im = ImageReader(str(path)); iw, ih = im.getSize()
    scale = max(w / iw, h / ih); sw, sh = iw * scale, ih * scale
    c.saveState(); p = c.beginPath(); p.rect(x, y, w, h); c.clipPath(p, stroke=0)
    c.drawImage(im, x + (w-sw)/2, y + (h-sh)/2, sw, sh, mask='auto')
    c.restoreState()

def label(c, text, x, y, color=INK):
    c.setFont("Mono", 7.2); c.setFillColor(color); c.drawString(x, y, text.upper())

def title(c, text, x, y, size=34, color=INK, leading=None):
    c.setFont("Bold", size); c.setFillColor(color); t=c.beginText(x,y); t.setLeading(leading or size*.95)
    for line in text.split("\n"): t.textLine(line)
    c.drawText(t)

def para(c, text, x, y, width_chars=58, size=10, color=INK, leading=15):
    c.setFont("Body", size); c.setFillColor(color); t=c.beginText(x,y); t.setLeading(leading)
    for p in text.split("\n"):
        for line in textwrap.wrap(p, width_chars) or [""]: t.textLine(line)
    c.drawText(t)
    return y - leading * sum(max(1, len(textwrap.wrap(p, width_chars))) for p in text.split("\n"))

def page_no(c, n, color=INK):
    c.setFont("Mono", 7); c.setFillColor(color); c.drawRightString(W-28, 18, f"PROLAY PANDA / GENAI VISUAL SYSTEMS / {n:02d}")

c=canvas.Canvas(str(OUT), pagesize=(W,H), pageCompression=1)
c.setTitle("Prolay Panda - GenAI Visual Systems Portfolio")

# 1 Cover
bg(c, INK); image_cover(c, ASSETS/"01-chaotic-birthday.png", W*0.57, 0, W*0.43, H)
c.setFillColor(LIME); c.rect(34, H-54, 170, 18, fill=1, stroke=0); label(c,"GENAI PROMPT ENGINEER",41,H-48)
title(c,"ART DIRECTION\nWITH A PULSE.",34,H-120,42,WHITE,40)
para(c,"Original visual systems, structured prompts and emotionally precise greeting-card concepts - created with ChatGPT / OpenAI Images.",36,H-232,48,11,WHITE,17)
label(c,"PROLAY KUMAR PANDA / 2026",36,42,PINK); page_no(c,1,WHITE); c.showPage()

# 2 Manifesto
bg(c); label(c,"01 / POSITIONING",36,H-38); title(c,"Not a one-off look.\nA reusable visual grammar.",36,H-82,35)
para(c,"I begin with the emotional job: what should this card let one person say to another? Style follows relationship, occasion and tone. The final prompt separates stable style DNA from controlled variables so the idea can expand into a coherent product library.",38,H-185,72,11,INK,17)
stats=[("04","RESEARCH LENSES"),("03","ORIGINAL STYLE SYSTEMS"),("17","FINISHED VISUAL STUDIES"),("02","DIAGNOSED ITERATIONS")]
for i,(num,cap) in enumerate(stats):
    x=38+i*195; c.setFillColor([PINK,LIME,BLUE,GRAY][i]); c.rect(x,80,170,110,fill=1,stroke=0); c.setFillColor(INK if i!=2 else WHITE); c.setFont("Bold",30); c.drawString(x+14,138,num); c.setFont("Mono",6.5); c.drawString(x+14,100,cap)
page_no(c,2); c.showPage()

# 3 Research translation
bg(c, WHITE); label(c,"02 / RESEARCH TRANSLATION",30,H-30,BLUE); title(c,"Signals in. Style systems out.",30,H-66,29)
para(c,"Directional desk research - not invented user testing. Four lenses were triangulated and translated into concrete art-direction rules.",32,H-108,90,9.5,INK,14)
research=[
 ("CREATIVE FORECAST","Tactile feeling beats sterile polish","Adobe's 2026 themes emphasize sensory texture, emotional connection and playful surrealism.","Use paper grain, visible repair, imperfect edges and one legible gesture."),
 ("VISUAL DISCOVERY","Curated individuality over sameness","Pinterest's 2026 forecast highlights poetcore, celestial cues, glitchy glamour and refined maximalism.","Combine signals through an owned grammar; never copy a micro-trend whole."),
 ("MARKETPLACE LANGUAGE","Humor is specific and relationship-aware","Etsy discovery language repeatedly frames Gen Z cards as funny, sassy and meme-aware.","Build jokes from relationship truths, not disposable internet references."),
 ("CATEGORY BEHAVIOR","The card must make someone feel seen","Category reporting emphasizes authenticity and heavier, less traditional life moments.","Emotion first, aesthetic second; expand beyond conventional occasions.")]
for i,(lens,head,evidence,decision) in enumerate(research):
    col=i%2; row=i//2; x=30+col*400; y=260-row*180
    c.setFillColor(PAPER); c.rect(x,y,375,155,fill=1,stroke=0); label(c,lens,x+14,y+132,BLUE); c.setFont("Bold",13); c.setFillColor(INK); c.drawString(x+14,y+104,head); para(c,evidence,x+14,y+82,55,7.6,INK,11); para(c,"Decision: "+decision,x+14,y+38,55,7.2,INK,10)
label(c,"SOURCES: ADOBE / PINTEREST PREDICTS / ETSY MARKET SCAN / HALLMARK / U.S. CHAMBER",30,42); page_no(c,3); c.showPage()

# 4-5 HeartStamp concepts
concepts=[
 ("01-chaotic-birthday.png","CHAOTIC BIRTHDAY","GLITCH GARDEN LETTERS","Joy / intensity 09","A visual detonation that stays usable: one hero silhouette, constrained palette and protected message space."),
 ("02-tender-apology.png","AWKWARD, BUT SINCERE","TENDER BRUTALISM","Vulnerability / intensity 06","Architectural certainty holds a fragile character. The tension between hard geometry and a repaired heart becomes the apology."),
 ("03-cosmic-friendship.png","SAME SKY, DIFFERENT WI-FI","COSMIC SCRAPBOOK","Closeness / intensity 07","Two private worlds connect through shared rituals. Personal objects replace generic friendship symbols."),
 ("04-breakup-recovery.png","WATER YOURSELF","NEO-BAUHAUS SURREALISM","Reclamation / intensity 08","Recovery without sad cliches: discarded red flags become birds while something new grows from the crack.")]
for page, pair in enumerate((concepts[:2],concepts[2:]),start=4):
    bg(c,INK); label(c,"02 / HEARTSTAMP CONCEPTS",30,H-30,LIME)
    for i,item in enumerate(pair):
        x=30+i*(W/2); image_cover(c,ASSETS/item[0],x,85,245,375)
        tx=x+260; c.setFillColor(LIME if i==0 else PINK); c.rect(tx,H-74,120,16,fill=1,stroke=0); label(c,item[3],tx+6,H-69)
        title(c,item[1].replace(" ","\n",1),tx,H-103,18,WHITE,20); label(c,item[2],tx,H-160,PINK if i==0 else LIME)
        para(c,item[4],tx,H-184,26,8.8,WHITE,13)
    page_no(c,page,WHITE); c.showPage()

# 6 Range
bg(c); label(c,"03 / STYLE RANGE",28,H-28); title(c,"One brief. Many visual dialects.",28,H-58,28)
range_items=[("05-watercolor.png","WATERCOLOR"),("06-product-photo.png","PRODUCT PHOTO"),("07-editorial.png","EDITORIAL"),("08-retro-cinema.png","RETRO CINEMA"),("09-cyberpunk.png","CYBERPUNK"),("10-bauhaus.png","BAUHAUS"),("11-anime-inspired.png","ANIMATION")]
for i,(fn,name) in enumerate(range_items):
    cols=4; row=i//cols; col=i%cols; x=28+col*202; y=260-row*205; image_cover(c,ASSETS/fn,x,y,184,180); c.setFillColor(INK); c.rect(x,y-18,184,18,fill=1,stroke=0); label(c,name,x+6,y-12,LIME)
page_no(c,6); c.showPage()

# 7 Systems
bg(c,LIME); label(c,"04 / ORIGINAL STYLE SYSTEMS",34,H-34); title(c,"Style is a set of decisions.",34,H-70,31)
systems=[("A","GLITCH GARDEN LETTERS","Botanical watercolor + fluorescent risograph + digital interference","One organic focal form / edge-only misregistration / 30% quiet space / imperfect texture"),("B","TENDER BRUTALISM","Brutalist geometry + vulnerable pencil + diary ephemera","Hard structures hold soft characters / one repaired object / restrained emotion"),("C","COSMIC SCRAPBOOK","Analog scrapbook + Y2K fragments + gentle aliencore","Two worlds / one connecting thread / personal objects / torn-paper depth")]
for i,(letter,name,mix,rules) in enumerate(systems):
    y=370-i*118; c.setStrokeColor(INK); c.line(34,y+72,W-34,y+72); c.setFont("Bold",28); c.drawString(34,y+28,letter); c.setFont("Bold",16); c.drawString(92,y+43,name); para(c,mix,92,y+24,55,8.5,INK,12); label(c,rules,420,y+34)
page_no(c,7); c.showPage()

# 8 Controlled variation test
bg(c,WHITE); label(c,"05 / CONTROLLED VARIATION TEST",28,H-28,PINK); title(c,"Same DNA. Different emotional jobs.",28,H-58,26)
variants=[
 ("glitch-garden-proud.png","GLITCH GARDEN / PROUD"),("glitch-garden-week.png","GLITCH GARDEN / WEEK"),
 ("tender-brutalism-support.png","TENDER / SUPPORT"),("tender-brutalism-thanks.png","TENDER / THANKS"),
 ("cosmic-scrapbook-family.png","COSMIC / FAMILY"),("cosmic-scrapbook-milestone.png","COSMIC / MILESTONE")]
for i,(fn,cap) in enumerate(variants):
    col=i%3; row=i//3; x=28+col*270; y=255-row*205; image_cover(c,ASSETS/fn,x,y,246,185); c.setFillColor(INK); c.rect(x,y-16,246,16,fill=1,stroke=0); label(c,cap,x+6,y-11,LIME)
para(c,"Result: all six retained their palette family, material logic and usable message space while producing distinct emotional scenarios. This is a small portfolio consistency test, not industrial-scale validation.",28,35,125,7.5,INK,11); page_no(c,8); c.showPage()

# 9 Iteration
bg(c,GRAY); label(c,"05 / ITERATION",28,H-28); title(c,"Diagnosis before decoration.",28,H-58,27)
cases=[("before-birthday.png","01-chaotic-birthday.png","COMPOSITION REPAIR","Crowded objects and no message space","One silhouette, controlled palette, upper-left safe zone"),("before-apology.png","02-tender-apology.png","EMOTIONAL FOCUS","A pile of symbols with no clear emotional action","One hesitant character offering one repaired object")]
for i,(before,after,cap,problem,fix) in enumerate(cases):
    y=60+(1-i)*220; image_cover(c,ASSETS/before,28,y,150,190); image_cover(c,ASSETS/after,197,y,150,190); c.setFont("Bold",18); c.setFillColor(INK); c.drawString(374,y+157,cap); label(c,"BEFORE",28,y+198); label(c,"AFTER",197,y+198); para(c,"Problem: "+problem+"\nCorrection: "+fix,374,y+128,62,9,INK,15)
page_no(c,9); c.showPage()

# 10 JSON
bg(c,BLUE); label(c,"06 / STRUCTURED PROMPTING",30,H-30,LIME); title(c,"Creative direction, stored as data.",30,H-66,30,WHITE)
code='''{
  "occasion": "chaotic_birthday",
  "relationship": "close_friend",
  "emotion": {"primary": "joy", "intensity": 9},
  "style_system": {
    "name": "Glitch Garden Letters",
    "influences": ["botanical watercolor", "risograph", "digital glitch"],
    "palette": ["#FF4F9A", "#D7FF3F", "#192180", "#FFF4DC"],
    "stable_rules": [
      "one oversized organic focal form",
      "misregistration limited to edges",
      "minimum 30 percent message-safe space"
    ]
  },
  "composition": {"aspect_ratio": "4:5", "text_safe_area": "upper-left"},
  "avoid": ["stock illustration", "embedded text", "artist imitation"]
}'''
c.setFillColor(HexColor("#0D0D13")); c.rect(30,60,500,360,fill=1,stroke=0); t=c.beginText(48,395); t.setFont("Mono",8.4); t.setFillColor(WHITE); t.setLeading(16)
for line in code.splitlines(): t.textLine(line)
c.drawText(t); title(c,"Stable DNA",560,370,18,LIME); para(c,"Palette, texture logic, composition rules and avoid-list remain fixed.",560,340,34,9,WHITE,14); title(c,"Controlled variables",560,245,18,PINK); para(c,"Occasion, relationship, emotion intensity, subject and message-safe position can change.",560,215,34,9,WHITE,14); page_no(c,10,WHITE); c.showPage()

# 11 Workflow / close
bg(c,INK); label(c,"07 / WORKFLOW",34,H-34,PINK); title(c,"Research -> structure -> generate\n-> evaluate -> refine.",34,H-78,32,WHITE,36)
steps=[("01","RESEARCH","Audience, emotion and visual culture"),("02","STRUCTURE","Stable DNA and controlled variables"),("03","GENERATE","OpenAI Images with explicit constraints"),("04","EVALUATE","Emotion, hierarchy, space, repeatability"),("05","REFINE","Single-variable fixes become reusable rules")]
for i,(n,name,desc) in enumerate(steps):
    x=34+i*158; c.setFillColor(PINK if i%2==0 else LIME); c.rect(x,150,144,120,fill=1,stroke=0); c.setFillColor(INK); c.setFont("Mono",8); c.drawString(x+10,250,n); c.setFont("Bold",12); c.drawString(x+10,218,name); para(c,desc,x+10,198,24,7.3,INK,11)
para(c,"PROLAY KUMAR PANDA\nGenAI prompt engineering + production systems\nTools represented honestly: ChatGPT / OpenAI Images",36,88,70,9,WHITE,15)
page_no(c,11,WHITE); c.showPage(); c.save()
print(OUT)
