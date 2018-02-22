### Windows driver issue for RNDIS
Good references if you're having this issue:
https://www.lifewire.com/how-to-fix-code-10-errors-2623181
https://superuser.com/questions/1151181/install-raspberry-pi-driver-on-other-windows-pc

Rolling back the driver and switching to a USB3.0 port worked for me.

---

### Changing username 

#### What does not work:
The itp image has default username itp. If you want to change, it does not do to make a new username, grant it root access and then delete itp. node, git and such software are installed in itp username by default and they will not be available to the new user.

#### What does work:
The best way I found was to make a new super user(call it user2), then change the old username(user1) when logged in as user2 via

	$ usermod -l newname oldname
	$ usermod -m -d /home/newname newname

Then log in as user1 (now renamed) and delete user2.

##### Reference:
https://www.modmypi.com/blog/how-to-change-the-default-account-username-and-password
https://itp.nyu.edu/networks/tutorials/setting-up-a-raspberry-pi/

---
### Securing SSH

Your default image comes with many deamons which appear as users. I don't know if it is possible for them to login through ssh, but better safe than sorry. The following code will allow only authorized users to access the pi via ssh:

	$ sudo nano /etc/ssh/sshd_config

Add this to EOF:

	AllowUsers [authorized_username] [another_authorized_username]

Exit nano by typing Ctrl+X, save and restart ssh:

	$ sudo systemctl restart ssh

##### Reference: 
https://www.makeuseof.com/tag/raspberry-pi-safe-secure/ 
Scroll down to point 3

---
### Disable ICMP redirect messages to prevent MITM

ICMP redirect messages can be used for man in the middle attack. To diasble it 

	$ sudo nano /etc/sysctl.conf

The edited file should look like:

	##############################################################3
	# Functions previously found in netbase
	#
	# Uncomment the next two lines to enable Spoof protection (reverse-path filter)
	# Turn on Source Address Verification in all interfaces to
	# prevent some spoofing attacks
	net.ipv4.conf.default.rp_filter=1
	net.ipv4.conf.all.rp_filter=1

	###################################################################
	# Additional settings - these settings can improve the network
	# security of the host and prevent against some network attacks
	# including spoofing attacks and man in the middle attacks through
	# redirection. Some network environments, however, require that these
	# settings are disabled so review and enable them as needed.
	#
	# Do not accept ICMP redirects (prevent MITM attacks)
	net.ipv4.conf.all.accept_redirects = 0
	net.ipv6.conf.all.accept_redirects = 0
	# _or_
	# Accept ICMP redirects only for gateways listed in our default
	# gateway list (enabled by default)
	# net.ipv4.conf.all.secure_redirects = 1
	#
	# Do not send ICMP redirects (we are not a router)
	net.ipv4.conf.all.send_redirects = 0
	#
	# Do not accept IP source route packets (we are not a router)
	net.ipv4.conf.all.accept_source_route = 0
	net.ipv6.conf.all.accept_source_route = 0
	#

##### Reference:
[Tutorial on protecting your network devices](https://www.hackster.io/charifmahmoudi/iot-security-tips-to-protect-your-device-from-bad-hackers-768093?ref=platform&ref_id=425_trending___&offset=0#toc-protect-your-network-2)
[More info on ICMP redirects](http://www.cymru.com/gillsr/documents/icmp-redirects-are-bad.htm)

---

### Setup a firewall

I used [Uncomplicated Firewall(UFW)](https://wiki.ubuntu.com/UncomplicatedFirewall) to configure my firewall. It's a wrapper in IP Tables and comes by default on many UNIX distributions. Check if you already have ufw by typing the following:

	$ ufw --version

You should get a result like:

	ufw 0.35
	Copyright 2008-2015 Canonical Ltd.

If it's not installed you can install it by typing:

	$ sudo apt install ufw

As soon as it's installed it might want to enable itself with the default settings which may lock you out if you're logged in via ssh. To prevent it from doing so, type:

	$ sudo ufw disable

Now to set up the rules:

Disable all incoming connections by default

	$ sudo ufw default deny 

Allow ssh, http and https

	$ sudo ufw allow 22 proto tcp
	$ sudo ufw allow 80 proto tcp
	$ sudo ufw allow 443 proto tcp
	$ sudo ufw logging on

Now that the rules are set, you can enable the firewall

	$ sudo ufw enable
	
---
### Setup Intrusion detection

Tripwire is a tool that analysis sytstem files and reports if any files have been modified by an attacker. This protects you from becoming part of a botnet, say. Tripwire requires a different passphrase from the user password to be modified. So even an attacker with root access cannot bypass it without deleting it outright which will be apparant to me as well. So this pretty much ensures that if someone modifies my system I get to know about it. I followed the instructions by [DigitalOcean community](https://www.digitalocean.com/community/tutorials/how-to-use-tripwire-to-detect-server-intrusions-on-an-ubuntu-vps)

##### Important tripwire commands:

Re-Initialize tripwire(e.g. after changing the database):
	
	$ sudo tripwire --init

Check system status:
	
	$ sudo tripwire --check


"okay" software changes so they don't trip a response:

	$ sudo tripwire --check --interactive

Change when tripwire is executed(it is executed via cron in my case):
	
	$ crontab -e

Tripwire sends a daily report to my email. Setting up terminal email
I followed this excellent guide: https://easyengine.io/tutorials/linux/ubuntu-postfix-gmail-smtp/

##### Important mail commands:
	
Change email address and password used:
	
	$ sudo nano /etc/postfix/asal_passwd

Restart postfix(the mail smtp client):
	
	$ sudo /etc/init.d/postfix reload

Send mail from terminal

	$ echo 'Test stuff' | mailx -s 'Test email' tinkrmind@gmail.com

I wanted to use snort to monitor network traffic, but was advised against it from [this](https://security.stackexchange.com/questions/163013/can-snort-run-on-a-raspberry-pi) thread, the main reason being that the pi zero does not have enough RAM and processing power to run snort. I chose instead to go with fail2ban which is [recommended](https://www.raspberrypi.org/documentation/configuration/security.md#Fail2ban) for rasbberry pi's.

I used digitalocean community [tutorial](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04) for setting up fail2ban.

##### Important fail2ban commands:

The best tutorial I found on fail2ban was again from the [DigitalOcean Community](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04)

Edit jail file:

	$ sudo nano /etc/fail2ban/jail.local

Start fail2ba
	sudo service fail2ban start

Stop fail2ban

	$ sudo service fail2ban stop

##### fail2ban fail!

I was getting this error when starting fail2ban:
	
	-- Unit fail2ban.service has begun starting up.
	Feb 21 21:52:45 tinkrmind-pi-zero fail2ban-client[2590]: ERROR  Failed during configuration: Recursion limit exceeded
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: fail2ban.service: Control process exited, code=exited status=255
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: Failed to start Fail2Ban Service.
	-- Subject: Unit fail2ban.service has failed
	-- Defined-By: systemd
	-- Support: https://www.debian.org/support
	--
	-- Unit fail2ban.service has failed.
	--
	-- The result is failed.
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: fail2ban.service: Unit entered failed state.
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: fail2ban.service: Failed with result 'exit-code'.
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: fail2ban.service: Service hold-off time over, scheduling restart.
	Feb 21 21:52:45 tinkrmind-pi-zero systemd[1]: Stopped Fail2Ban Service.
	-- Subject: Unit fail2ban.service has finished shutting down
	-- Defined-By: systemd
	-- Support: https://www.debian.org/support

So I uninstalled and reinstalled fail2ban. That seemed to solve the problem. I haven't been able to discover the source of the problem. I likely mucked something up in some config file.

---

### Sending https requests via python

I used requests library to send https post requests via python. The library is well documented, maintained and has just the right level of abstraction. Documentation [here](http://docs.python-requests.org/en/master/user/quickstart/#custom-headers).

A minimum viable code that sends requests:

	import requests
	header = {'Content-Type': 'application/json'}
	payload = {"macAddress":"12:12", "sessionKey": "1212", "data": {"temp":"76"}}
	res = requests.post('https://connected-devices-itp.herokuapp.com/add', json =payload,  headers =header)     
	print(res.text)

**Seriously**, don't waste time with urllib or http client. requests is awesome!

---
