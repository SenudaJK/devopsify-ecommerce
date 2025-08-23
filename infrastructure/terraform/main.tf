provider "aws" {
  region = "us-west-2"  # Change to your preferred region
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "devopsify-vpc"
  }
}

resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-west-2a"  # Change as needed

  tags = {
    Name = "devopsify-public-subnet"
  }
}

resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-west-2a"  # Change as needed

  tags = {
    Name = "devopsify-private-subnet"
  }
}

resource "aws_eks_cluster" "main" {
  name     = "devopsify-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = [aws_subnet.public.id, aws_subnet.private.id]
  }

  depends_on = [aws_iam_role_policy_attachment.eks_policy]
}

resource "aws_iam_role" "eks_role" {
  name = "devopsify-eks-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Effect    = "Allow"
      Sid       = ""
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_role.name
}

resource "aws_rds_cluster" "main" {
  cluster_identifier      = "devopsify-db"
  engine                 = "postgres"
  master_username        = "admin"
  master_password        = "yourpassword"  # Change to a secure password
  skip_final_snapshot    = true

  tags = {
    Name = "devopsify-rds"
  }
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "devopsify-artifacts-bucket"

  tags = {
    Name = "devopsify-artifacts"
  }
}