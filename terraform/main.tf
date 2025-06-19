provider "aws" {
  region = "ap-south-1"  # Mumbai region
}

resource "aws_instance" "blog_server" {
  ami                    = "ami-0f58b397bc5c1f2e8" # Ubuntu 22.04 for ap-south-1
  instance_type          = "t2.micro"
  key_name               = "EC2"  # Your existing key pair name
  associate_public_ip_address = true

  vpc_security_group_ids = [aws_security_group.blog_sg.id]

  tags = {
    Name = "DevOps-Blog-Server"
  }

  provisioner "remote-exec" {
    inline = ["sudo apt update -y"]
    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("~/.ssh/EC2.pem")
      host        = self.public_ip
    }
  }
}

resource "aws_security_group" "blog_sg" {
  name        = "blog-sg"
  description = "Allow SSH, HTTP, HTTPS, Jenkins, K8s"

  ingress = [
    for port in [22, 80, 443, 3000, 8080, 9090, 9091, 9100, 32000, 32001] : {
      description      = "Allow port ${port}"
      from_port        = port
      to_port          = port
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

