from locust import HttpUser,TaskSet,task,between
import random


class MyTaskSet(TaskSet):
	@task
	def index(self):
		id = random.randint(1,30)
		self.client.get("/api/articles/"+str(id))


class MyLocus(HttpUser):
	task_set = MyTaskSet
	wait_time = between(3,5)
	domain = "@a.com"
	password = "12341234"
	name = "name"

	@task
	def index(self):
		id = random.randint(1,30)
		# self.client.get("/api/articles/"+str(id))
		self.login()

	def on_start(self):
		# self.name = random.randint(1,30) + "asdb"
		# self.login()
		# self.signup()
		pass

	def login(self):
		self.client.post("/api/accounts/signin", {"email": "root@root.com", "password":"1234"})

	# def signup(self):
	# 	self.client.post("/api/accounts/signup", {"email": "root@root.com", "password":"1234"})