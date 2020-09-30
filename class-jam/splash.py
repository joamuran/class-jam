import sys
import gobject
import pango
import pygtk
import gtk
from gtk import gdk
import cairo
import gobject
import time
import glib
import threading
import os

class splashScreen:
	def __init__(self, bgimg):
		self.width=800;
		self.height=600;
		self.lockfile="/tmp/.classroom-assembly-working";
		self.bgimg=bgimg;

        # Create Top Level Window
		self.window = gtk.Window(gtk.WINDOW_TOPLEVEL)
		
        # Remove decoration
		self.window.set_decorated(0)

		# Set splash position
		self.window.set_position(gtk.WIN_POS_CENTER)

        # Set splash window size
		self.window.set_default_size(self.width, self.height)
		
        # Masking events
		self.window.set_events(gtk.gdk.ALL_EVENTS_MASK)
		
		# Initialize RGBA
		self.window.set_app_paintable(1)

        # Setting screen
		self.gtk_screen = self.window.get_screen()

        # Setting Colormap
		colormap = self.gtk_screen.get_rgba_colormap()
		if colormap == None:
			colormap = self.gtk_screen.get_rgb_colormap()
		gtk.widget_set_default_colormap(colormap)

        # Is composite enable?
		if not self.window.is_composited():
			self.supports_alpha = False
		else:
			self.supports_alpha = True
		
		self.w,self.h = self.window.get_size()
		print "w="+str(self.w)+" h="+str(self.h)
		print "x="+str(self.width)+" y="+str(self.height)
		# Binding events
		self.window.connect("expose_event", self.expose)
		self.window.connect("destroy", gtk.main_quit)
		

	def expose (self, widget, event):
		self.ctx = self.window.window.cairo_create()
		# set a clip region for the expose event, XShape stuff
		self.ctx.save()
		if self.supports_alpha == False:
			self.ctx.set_source_rgb(1, 1, 1)
		else:
			self.ctx.set_source_rgba(1, 1, 1,0)
		self.ctx.set_operator (cairo.OPERATOR_SOURCE)
		self.ctx.paint()
		self.ctx.restore()
		self.ctx.rectangle(event.area.x, event.area.y,
				event.area.width, event.area.height)
		self.ctx.clip()
		self.draw_image(self.ctx,0,0,self.bgimg)

	def setup(self):
		# Setting background
		self.background =  gtk.Image()
		self.frame = gtk.Fixed()
		self.window.add (self.frame)
		
		# Set window shape from alpha mask of background image
		w,h = self.window.get_size()
		if w==0: w = self.width
		if h==0: h = self.height
		self.w = w
		self.h = h
		self.pixmap = gtk.gdk.Pixmap (None, w, h, 1)
		ctx = self.pixmap.cairo_create()
		
		ctx.save()
		ctx.set_source_rgba(1, 1, 1,0)
		ctx.set_operator (cairo.OPERATOR_SOURCE)
		ctx.paint()
		ctx.restore()
		self.draw_image(ctx,0,0,self.bgimg)
		
		if self.window.is_composited():
			ctx.rectangle(0,0,w,h)
			ctx.fill()			
			self.window.input_shape_combine_mask(self.pixmap,0,0)
		else:
			self.window.shape_combine_mask(self.pixmap, 0, 0)

	def draw_image(self,ctx,x,y, pix):
		"""Draws a picture from specified path with a certain width and
height"""

		ctx.save()
		ctx.translate(x, y)	
		pixbuf = gtk.gdk.pixbuf_new_from_file(pix)
		format = cairo.FORMAT_RGB24
		if pixbuf.get_has_alpha():
			format = cairo.FORMAT_ARGB32
		#if Images.flip != None:
		#	pixbuf = pixbuf.flip(Images.flip)
	
		iw = pixbuf.get_width()
		ih = pixbuf.get_height()
		image = cairo.ImageSurface(format, iw, ih)
		image = ctx.set_source_pixbuf(pixbuf, 0, 0)
		
		ctx.paint()
		puxbuf = None
		image = None
		ctx.restore()
		ctx.clip()

	def show(self):
		self.window.show_all()
		while gtk.events_pending():
			gtk.main_iteration()
		self.window.present()
		self.window.grab_focus()
		self.p = 1

	def update_progess(self, i):
		print i
		time.sleep(0.2)

	def autodestroy(self):
		if (os.path.isfile(self.lockfile)):
			os.remove(self.lockfile);
			self.window.destroy()
		else:
			return True
		
		
if __name__ == "__main__":
	# gobject.threads_init()
	background="/usr/share/class-jam/splash.png"
	splash = splashScreen(background)
	splash.setup()
	splash.show()

	gobject.timeout_add(1000, splash.autodestroy)

	#thread = threading.Thread(target=splash.autodestroy)
	#thread.daemon = True
	#thread.start()

	
	gtk.main()
