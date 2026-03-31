#!/bin/bash
# Azure VM Initial Setup Script for Jenkins + Docker
# Run this entire script on your freshly created Ubuntu VM

echo "Updating packages..."
sudo apt update -y && sudo apt upgrade -y

echo "Installing Docker..."
# Install prerequisites for Docker
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
# Add Docker Repo
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
# Install Docker Engine
sudo apt update -y
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

echo "Installing Jenkins..."
# Install Java 17 (Required for Jenkins)
sudo apt install openjdk-17-jre -y
# Add Jenkins GPG key
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
# Add Jenkins repo
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
# Install Jenkins
sudo apt update -y
sudo apt install jenkins -y

echo "Configuring Permissions..."
# Allow Jenkins to run Docker without sudo
sudo usermod -aG docker jenkins
sudo usermod -aG docker ubuntu

# Restart services
sudo systemctl restart docker
sudo systemctl restart jenkins
sudo systemctl enable jenkins

echo "============== ALL DONE! =============="
echo "Jenkins is starting. In 30 seconds, go to http://<YOUR_VM_PUBLIC_IP>:8080"
echo "Your initial Jenkins Admin Password is:"
sleep 5
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
