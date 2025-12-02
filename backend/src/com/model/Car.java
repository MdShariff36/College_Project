package com.carrental.model;

public class Car {
    private int id;
    private String make;
    private String model;
    private int year;
    private String fuel;
    private double price;
    private String features; // CSV or JSON string
    private String image;
    private String location;
    private String status;

    public Car() {}

    // getters / setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }

    public String getFuel() { return fuel; }
    public void setFuel(String fuel) { this.fuel = fuel; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getFeatures() { return features; }
    public void setFeatures(String features) { this.features = features; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
